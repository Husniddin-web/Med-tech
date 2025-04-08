import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { AuthJwt } from "../common/guards/jwt.guard";
import { SuperAdminGuard } from "../common/guards/superadmin.guard";
import { SelfGuard } from "../common/guards/self.guard";
import { AdminService } from "./admin.service";

@ApiTags("Admin")
@ApiBearerAuth("token")
@Controller("admin")
export class AdminController {
	constructor(private readonly adminService: AdminService) {}

	@UseGuards(AuthJwt, SuperAdminGuard)
	@Get()
	@ApiOperation({ summary: "Get all admins" })
	@ApiResponse({ status: 200, description: "Returns a list of admins" })
	findAll() {
		return this.adminService.findAll();
	}

	@UseGuards(AuthJwt)
	@Get(":id")
	@ApiOperation({ summary: "Get admin by ID" })
	@ApiResponse({ status: 200, description: "Returns admin details" })
	findOne(@Param("id") id: string) {
		return this.adminService.findOne(+id);
	}

	@UseGuards(AuthJwt, SelfGuard)
	@Patch(":id")
	@ApiOperation({ summary: "Update admin details  !!" })
	@ApiResponse({ status: 200, description: "Admin updated successfully" })
	update(@Param("id") id: string, @Body() updateAdminDto: UpdateAdminDto) {
		return this.adminService.update(+id, updateAdminDto);
	}

	@UseGuards(AuthJwt, SuperAdminGuard)
	@Delete(":id")
	@ApiOperation({ summary: "Delete an admin" })
	@ApiResponse({ status: 200, description: "Admin deleted successfully" })
	remove(@Param("id") id: string) {
		return this.adminService.remove(+id);
	}
}
