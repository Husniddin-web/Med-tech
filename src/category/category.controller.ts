// import {
// 	Controller,
// 	Get,
// 	Post,
// 	Body,
// 	Patch,
// 	Param,
// 	Delete,
// 	UseGuards,
// 	UploadedFile,
// 	UseInterceptors,
// 	BadRequestException,
// 	Query,
// } from "@nestjs/common";
// import { FileInterceptor } from "@nestjs/platform-express";
// import { CategoryService } from "./category.service";
// import { CreateCategoryDto } from "./dto/create-category.dto";
// import { UpdateCategoryDto } from "./dto/update-category.dto";
// import { UpdateCategoryTranslationDto } from "./dto/update-category-translation.dto";
// import { CreateCategoryTranslationDto } from "./dto/category-translation.dto";
// import { AuthJwt } from "../common/guards/jwt.guard";
// import { AdminGuard } from "../common/guards/admin.guard";
// import { FileUploadService } from "../file-upload/file-upload.service";
// import { CurrentLanguage } from "../common/decorators";

// @Controller("category")
// export class CategoryController {
// 	constructor(
// 		private readonly categoryService: CategoryService,
// 		private readonly fileUploadService: FileUploadService,
// 	) {}

// 	@UseGuards(AuthJwt, AdminGuard)
// 	@Post()
// 	@UseInterceptors(FileInterceptor("logo"))
// 	async create(@Body() createCategoryDto: CreateCategoryDto, @UploadedFile() logo?: any) {
// 		if (logo) {
// 			createCategoryDto.logo = await this.fileUploadService.saveFile(logo);
// 		}

// 		if (typeof createCategoryDto.translations === "string") {
// 			try {
// 				createCategoryDto.translations = JSON.parse(createCategoryDto.translations);
// 			} catch (error) {
// 				throw new BadRequestException("Invalid JSON format for translations");
// 			}
// 		}

// 		return this.categoryService.create(createCategoryDto);
// 	}

// 	@UseGuards(AuthJwt, AdminGuard)
// 	@Get()
// 	findAll() {
// 		return this.categoryService.findAll();
// 	}

// 	@Get("by-lang")
// 	findAllCategoryByLang(@CurrentLanguage() languageId: number) {
// 		return this.categoryService.findAllByLang(languageId);
// 	}

// 	@UseGuards(AuthJwt, AdminGuard)
// 	@Get(":id")
// 	findOne(@Param("id") id: string) {
// 		return this.categoryService.findOne(+id);
// 	}

// 	@Get("by-lang/:id")
// 	findOneByLang(@Param("id") id: number, @CurrentLanguage() languageId: number) {
// 		return this.categoryService.findOneByLang(id, languageId);
// 	}

// 	@UseGuards(AuthJwt, AdminGuard)
// 	@Patch(":id")
// 	@UseInterceptors(FileInterceptor("logo"))
// 	async update(
// 		@Param("id") id: string,
// 		@Body() updateCategoryDto: UpdateCategoryDto,
// 		@UploadedFile() logo?: any,
// 	) {
// 		if (logo) {
// 			updateCategoryDto.logo = await this.fileUploadService.saveFile(logo);
// 		}
// 		if (typeof updateCategoryDto.translations === "string") {
// 			try {
// 				updateCategoryDto.translations = JSON.parse(updateCategoryDto.translations);
// 			} catch (error) {
// 				throw new BadRequestException("Invalid JSON format for translations");
// 			}
// 		}
// 		return this.categoryService.update(+id, updateCategoryDto);
// 	}

// 	@UseGuards(AuthJwt, AdminGuard)
// 	@Delete(":id")
// 	remove(@Param("id") id: string) {
// 		return this.categoryService.remove(+id);
// 	}

// 	@UseGuards(AuthJwt, AdminGuard)
// 	@Patch(":id/translation/:languageId")
// 	updateTranslation(
// 		@Param("id") id: string,
// 		@Param("languageId") languageId: string,
// 		@Body() dto: UpdateCategoryTranslationDto,
// 	) {
// 		return this.categoryService.updateCategoryTranslation(+id, +languageId, dto);
// 	}

// 	@UseGuards(AuthJwt, AdminGuard)
// 	@Post(":id/translation")
// 	addTranslation(@Param("id") id: string, @Body() dto: CreateCategoryTranslationDto) {
// 		return this.categoryService.addCategoryTranslation(+id, dto);
// 	}
// }

import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	UploadedFile,
	UseInterceptors,
	BadRequestException,
	Query,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { UpdateCategoryTranslationDto } from "./dto/update-category-translation.dto";
import { CreateCategoryTranslationDto } from "./dto/category-translation.dto";
import { AuthJwt } from "../common/guards/jwt.guard";
import { AdminGuard } from "../common/guards/admin.guard";
import { FileUploadService } from "../file-upload/file-upload.service";
import { CurrentLanguage } from "../common/decorators";
import {
	ApiBearerAuth,
	ApiHeader,
	ApiOperation,
	ApiResponse,
	ApiTags,
	ApiBody,
	ApiConsumes,
} from "@nestjs/swagger";
import { log } from "console";
import { CategoryService } from "./category.service";

@ApiTags("Category")
@Controller("category")
export class CategoryController {
	constructor(
		private readonly categoryService: CategoryService,
		private readonly fileUploadService: FileUploadService,
	) {}

	@UseGuards(AuthJwt, AdminGuard)
	@Post()
	@ApiBearerAuth("token")
	@ApiOperation({ summary: "Create a category" })
	@ApiResponse({ status: 201, description: "Category created successfully" })
	@ApiConsumes("multipart/form-data")
	@ApiBody({
		description: "Category data including logo (if provided)",
		type: CreateCategoryDto,
	})
	@UseInterceptors(FileInterceptor("logo"))
	async create(@Body() createCategoryDto: CreateCategoryDto, @UploadedFile() logo?: any) {
		if (!logo) {
			throw new BadRequestException("logo should provied");
		}
		createCategoryDto.logo = await this.fileUploadService.saveFile(logo);
		if (typeof createCategoryDto.translations == "string") {
			createCategoryDto.translations = JSON.parse(createCategoryDto.translations);
		}
		return this.categoryService.create(createCategoryDto);
	}

	@UseGuards(AuthJwt, AdminGuard)
	@ApiBearerAuth("token")
	@ApiOperation({ summary: "Get all  categories with all translation" })
	@ApiResponse({ status: 200, description: "Successfully fetched categories " })
	@Get()
	findAll() {
		return this.categoryService.findAll();
	}

	@ApiHeader({
		name: "lang",
		description: "Language ID (e.g., 1 for English, 2 for Spanish)",
		required: true,
		example: "1",
	})
	@Get("by-lang")
	@ApiOperation({ summary: "Get categories by language" })
	@ApiResponse({ status: 200, description: "Successfully fetched categories by language" })
	findAllCategoryByLang(@CurrentLanguage() languageId: number) {
		return this.categoryService.findAllByLang(languageId);
	}

	// Fetch category by ID
	@UseGuards(AuthJwt, AdminGuard)
	@ApiOperation({ summary: "Get category by id with all translation" })
	@ApiResponse({ status: 200, description: "Successfully fetched category " })
	@ApiBearerAuth("token")
	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.categoryService.findOne(+id);
	}

	@ApiHeader({
		name: "lang",
		description: "Language ID (e.g., 1 for English, 2 for Spanish)",
		required: true,
		example: "1",
	})
	@Get("by-lang/:id")
	@ApiOperation({ summary: "Get category by language and ID" })
	@ApiResponse({ status: 200, description: "Successfully fetched category by language and ID" })
	findOneByLang(@Param("id") id: number, @CurrentLanguage() languageId: number) {
		return this.categoryService.findOneByLang(id, languageId);
	}

	@UseGuards(AuthJwt, AdminGuard)
	@Patch(":id")
	@ApiBearerAuth("token")
	@ApiOperation({ summary: "Update category" })
	@ApiResponse({ status: 200, description: "Category updated successfully" })
	@ApiConsumes("multipart/form-data")
	@ApiBody({
		description: "Updated category data including logo (if provided)",
		type: UpdateCategoryDto,
	})
	@UseInterceptors(FileInterceptor("logo"))
	async update(
		@Param("id") id: string,
		@Body() updateCategoryDto: UpdateCategoryDto,
		@UploadedFile() logo?: any,
	) {
		if (logo) {
			updateCategoryDto.logo = await this.fileUploadService.saveFile(logo);
		}
		if (typeof updateCategoryDto.translations === "string") {
			try {
				updateCategoryDto.translations = JSON.parse(updateCategoryDto.translations);
			} catch (error) {
				throw new BadRequestException("Invalid JSON format for translations");
			}
		}
		return this.categoryService.update(+id, updateCategoryDto);
	}

	// Delete category
	@UseGuards(AuthJwt, AdminGuard)
	@ApiBearerAuth("token")
	@ApiOperation({ summary: "Delete category" })
	@ApiResponse({ status: 200, description: "Category deleted successfully" })
	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.categoryService.remove(+id);
	}
	@UseGuards(AuthJwt, AdminGuard)
	@ApiBearerAuth("token")
	@ApiOperation({ summary: "Delete category translation" })
	@ApiResponse({ status: 200, description: "Category deleted successfully" })
	@Delete(":id/remove/:languageId")
	removeCategoryTranslation(@Param("id") id: string, @Param("langId") langId: string) {
		return this.categoryService.removeCategoryTranslation(+id, +langId);
	}

	@UseGuards(AuthJwt, AdminGuard)
	@Patch(":id/translation/:languageId")
	@ApiBearerAuth("token")
	@ApiOperation({ summary: "Update category translation" })
	@ApiResponse({ status: 200, description: "Category translation updated successfully" })
	updateTranslation(
		@Param("id") id: string,
		@Param("languageId") languageId: string,
		@Body() dto: UpdateCategoryTranslationDto,
	) {
		return this.categoryService.updateCategoryTranslation(+id, +languageId, dto);
	}

	@UseGuards(AuthJwt, AdminGuard)
	@Post(":id/translation")
	@ApiBearerAuth("token")
	@ApiOperation({ summary: "Add category translation" })
	@ApiResponse({ status: 201, description: "Category translation added successfully" })
	addTranslation(@Param("id") id: string, @Body() dto: CreateCategoryTranslationDto) {
		return this.categoryService.addCategoryTranslation(+id, dto);
	}
}
