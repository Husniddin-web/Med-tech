import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LanguageService } from "./language.service";
import { CreateLanguageDto } from "./dto/create-language.dto";
import { UpdateLanguageDto } from "./dto/update-language.dto";
import { AuthJwt } from "../common/guards/jwt.guard";
import { AdminGuard } from "../common/guards/admin.guard";

@ApiTags("Languages") // Organizes endpoints in Swagger
@Controller("language")
export class LanguageController {
	constructor(private readonly languageService: LanguageService) {}

	@ApiOperation({ summary: "Create a new language" })
	@ApiResponse({ status: 201, description: "Language created successfully" })
	@ApiResponse({ status: 403, description: "Forbidden: Admin access required" })
	@ApiBearerAuth("token") // Requires Bearer Token
	@UseGuards(AuthJwt, AdminGuard)
	@Post()
	create(@Body() createLanguageDto: CreateLanguageDto) {

		
		return this.languageService.create(createLanguageDto);
	}

	@ApiOperation({ summary: "Get all languages" })
	@ApiResponse({ status: 200, description: "List of languages retrieved successfully" })
	@Get()
	findAll() {
		return this.languageService.findAll();
	}

	@ApiOperation({ summary: "Get a language by ID" })
	@ApiResponse({ status: 200, description: "Language retrieved successfully" })
	@ApiResponse({ status: 404, description: "Language not found" })
	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.languageService.findOne(+id);
	}

	@ApiOperation({ summary: "Update a language by ID" })
	@ApiResponse({ status: 200, description: "Language updated successfully" })
	@ApiResponse({ status: 403, description: "Forbidden: Admin access required" })
	@ApiResponse({ status: 404, description: "Language not found" })
	@ApiBearerAuth()
	@UseGuards(AuthJwt, AdminGuard)
	@Patch(":id")
	update(@Param("id") id: string, @Body() updateLanguageDto: UpdateLanguageDto) {
		return this.languageService.update(+id, updateLanguageDto);
	}

	@ApiOperation({ summary: "Delete a language by ID" })
	@ApiResponse({ status: 200, description: "Language deleted successfully" })
	@ApiResponse({ status: 403, description: "Forbidden: Admin access required" })
	@ApiResponse({ status: 404, description: "Language not found" })
	@ApiBearerAuth()
	@UseGuards(AuthJwt, AdminGuard)
	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.languageService.remove(+id);
	}
}
