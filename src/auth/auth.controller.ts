import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiProperty } from "@nestjs/swagger";
import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	HttpCode,
	Res,
	UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { CreateAdminDto } from "../admin/dto/create-admin.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { GetCurrentUserId } from "../common/decorators";
import { RefreshTokenGuard } from "../common/guards/refresh-token.guard";
import { CookieGetter } from "../common/decorators/cookie-getter.decorator";
import { AuthJwt } from "../common/guards/jwt.guard";
import { SuperAdminGuard } from "../common/guards/superadmin.guard";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(AuthJwt, SuperAdminGuard)
	@Post("admin-register")
	@HttpCode(200)
	@ApiBearerAuth("token")
	@ApiOperation({ summary: "Register a new admin only super admin" })
	@ApiResponse({ status: 200, description: "Admin registered successfully" })
	async registerAdmin(@Body() dto: CreateAdminDto) {
		return await this.authService.adminRegister(dto);
	}

	// @Post("user-signup")
	// @HttpCode(200)
	// @ApiOperation({ summary: "User signup" })
	// @ApiResponse({ status: 200, description: "User signed up successfully" })
	// async signUpAdmin(@Body() dto: CreateUserDto) {
	// 	return await this.authService.signUpUser(dto);
	// }

	@Post("admin-login")
	@HttpCode(200)
	@ApiOperation({ summary: "Admin login" })
	@ApiResponse({ status: 200, description: "Admin logged in successfully" })
	async adminLogin(@Body() dto: SignInDto, @Res({ passthrough: true }) res: Response) {
		return await this.authService.signInAdmin(dto, res);
	}

	@UseGuards(RefreshTokenGuard)
	@Post("admin-sign-out")
	@HttpCode(200)
	@ApiBearerAuth("token")
	@ApiOperation({ summary: "Admin sign out" })
	@ApiResponse({ status: 200, description: "Admin signed out successfully" })
	async adminSignOut(@GetCurrentUserId() id: number, @Res({ passthrough: true }) res: Response) {
		return await this.authService.signOut(id, res);
	}

	@UseGuards(RefreshTokenGuard)
	@Post("admin-refresh-token")
	@ApiBearerAuth("token")
	@ApiOperation({ summary: "Refresh admin tokens" })
	@ApiResponse({ status: 200, description: "Tokens refreshed successfully" })
	async refreshAdminTokens(
		@GetCurrentUserId() userId: number,
		@CookieGetter("refresh_token") refreshToken: string,
		@Res({ passthrough: true }) res: Response,
	) {
		return this.authService.refreshTokenAdmin(userId, refreshToken, res);
	}

	// @Post("user-activate")
	// @ApiOperation({ summary: "Activate user account" })
	// @ApiResponse({ status: 200, description: "User activated successfully" })
	// async activateUser(@Param("link") link: string) {
	// 	return this.authService.activateUser(link);
	// }
}
