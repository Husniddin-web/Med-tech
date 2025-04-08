import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { CreateAdminDto } from "../admin/dto/create-admin.dto";
import { MailService } from "../mail/mail.service";
import { SignInDto } from "./dto/sign-in.dto";
import { JwtPayload, ResponseFields } from "../common/types";
import * as bcrypt from "bcrypt";
import { Admin, User } from "@prisma/client";
import { Response } from "express";
import * as uuid from "uuid";
import { AdminService } from "../admin/admin.service";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly adminService: AdminService,
    private jwtService: JwtService,
    private mailService: MailService
  ) {}

  private async generateTokenAdmin(user: any) {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
    };

    if (user.is_creator) {
      payload.is_creator = true;
    }
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.ACCESS_TOKEN_LIFE_TIME,
      }),

      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.REFRESH_TOKEN_LIFE_TIME,
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async adminRegister(createAdminDto: CreateAdminDto) {
    const isExist = await this.adminService.findByEmail(createAdminDto.email);

    if (isExist) {
      throw new BadRequestException("Admin already exist");
    }

    const user = await this.adminService.create(createAdminDto);

    await this.mailService.sendMailToAdmin({
      ...user,
      password: createAdminDto.password,
    });

    return { message: "Successfully created admin" };
  }

  async signInAdmin(
    siginDto: SignInDto,
    res: Response
  ): Promise<ResponseFields> {
    const admin = await this.adminService.findByEmail(siginDto.email);

    if (!admin) {
      throw new BadRequestException("Email yoki parol notogri");
    }

    const isMatch = await bcrypt.compare(siginDto.password, admin.password);

    if (!isMatch) {
      throw new BadRequestException("Email yoki parol notogri");
    }

    const tokens = await this.generateTokenAdmin(admin);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 10);

    const isSaved = await this.adminService.updateRefreshToken(
      admin.id,
      hashed_refresh_token
    );

    if (!isSaved) {
      throw new InternalServerErrorException("Tokenni saqlashda xatolik");
    }
    res.cookie("refresh_token", tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    const response = {
      id: admin.id,
      access_token: tokens.access_token,
    };

    return response;
  }

  async signOut(userId: number, res: Response) {
    const isUpdated = await this.adminService.updateRefreshToken(userId, null);

    if (!isUpdated) {
      throw new InternalServerErrorException("Error signing out");
    }

    res.clearCookie("refresh_token", { httpOnly: true, secure: true });

    return { message: "Successfully signed out" };
  }

  async refreshTokenAdmin(
    adminId: number,
    refreshToken: string,
    res: Response
  ): Promise<ResponseFields> {
    const admin = await this.adminService.findOne(adminId);

    if (!admin || !admin.refresh_token) {
      throw new BadRequestException("Admin not found");
    }

    const tokenMatch = await bcrypt.compare(refreshToken, admin.refresh_token);

    if (!tokenMatch) {
      throw new ForbiddenException();
    }

    const tokens = await this.generateTokenAdmin(admin);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 10);

    await this.adminService.updateRefreshToken(admin.id, hashed_refresh_token);
    res.cookie("refresh_token", tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    const response = {
      id: admin.id,
      access_token: tokens.access_token,
    };

    return response;
  }

  // async signUpUser(dto: CreateUserDto) {
  //   const isExist = await this.userService.findByEmail(dto.email);

  //   if (isExist) {
  //     throw new BadRequestException("User already exist");
  //   }

  //   const activation_link = uuid.v4();

  //   const user = await this.userService.create({ ...dto, activation_link });

  //   await this.mailService.sendMailToAdmin({ ...user, password: dto.password });

  //   return { message: "Successfully sign up user check email" };
  // }

  // async activateUser(link: string) {
  //   if (!link) {
  //     throw new BadRequestException("Activation link is required");
  //   }

  //   const updatedUser = await this.prisma.user.updateMany({
  //     where: { activation_link: link, is_active: false },
  //     data: { is_active: true, activation_link: null },
  //   });

  //   if (updatedUser.count === 0) {
  //     throw new BadRequestException("Invalid or already activated link");
  //   }

  //   return { message: "User activated successfully!" };
  // }
}
