import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AdminService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createAdminDto: CreateAdminDto) {
		const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);
		const admin = await this.prisma.admin.create({
			data: { ...createAdminDto, password: hashedPassword },
		});
		return admin;
	}

	async findAll() {
		return await this.prisma.admin.findMany();
	}

	async findOne(id: number) {
		const user = await this.prisma.admin.findUnique({ where: { id } });
		if (!user) {
			throw new NotFoundException();
		}
		return user;
	}

	async update(id: number, updateAdminDto: UpdateAdminDto) {
		await this.findOne(id);
		if (updateAdminDto.password) {
			updateAdminDto.password = await bcrypt.hash(updateAdminDto.password, 10);
		}
		return this.prisma.admin.update({ where: { id }, data: updateAdminDto });
	}

	async findByEmail(email: string) {
		return this.prisma.admin.findUnique({ where: { email } });
	}

	async remove(id: number) {
		await this.findOne(id);

		return this.prisma.admin.delete({ where: { id } });
	}

	async updateRefreshToken(id: number, hashed_refresh_token: string | null) {
		const updatedUser = await this.prisma.admin.update({
			where: { id },
			data: { refresh_token: hashed_refresh_token },
		});
		return updatedUser;
	}
}
