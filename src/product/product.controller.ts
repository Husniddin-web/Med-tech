import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { CreateProductTranslationDto } from "./dto/create-product-translation.dto";
import { UpdateProductTranslationDto } from "./dto/update-translation-product.dto";
import { FileUploadService } from "../file-upload/file-upload.service";
import { AuthJwt } from "../common/guards/jwt.guard";
import { AdminGuard } from "../common/guards/admin.guard";
import { CurrentLanguage } from "../common/decorators";
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiConsumes,
  ApiQuery,
} from "@nestjs/swagger";
import { ProductService } from "./product.service";

@ApiTags("Product")
@Controller("product")
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly fileUploadService: FileUploadService
  ) {}

  @UseGuards(AuthJwt, AdminGuard)
  @Post()
  @ApiBearerAuth("token")
  @ApiOperation({ summary: "Create a product" })
  @ApiResponse({ status: 201, description: "Product created successfully" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Product data including images",
    type: CreateProductDto,
  })
  @UseInterceptors(FileInterceptor("images"))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() images?: any
  ) {
    if (!images) {
      throw new BadRequestException("Image is not provided");
    }
    createProductDto.images = await this.fileUploadService.saveFile(images);

    if (typeof createProductDto.translations === "string") {
      try {
        createProductDto.translations = JSON.parse(
          createProductDto.translations
        );
      } catch (error) {
        throw new BadRequestException("Invalid JSON format for translations");
      }
    }
    return this.productService.create(createProductDto);
  }

  @Get("search")
  @ApiOperation({ summary: "Search for products" })
  @ApiHeader({
    name: "lang",
    description: "Language ID (e.g., 1 for English, 2 for Spanish)",
    required: true,
    example: "1",
  })
  @ApiQuery({ name: "term", required: true, type: String })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiResponse({ status: 200, description: "Products found" })
  async searchProduct(
    @Query("term") term: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @CurrentLanguage() lang?: number
  ) {
    const pagination =
      page && limit ? { page: +page, limit: +limit } : undefined;
    return this.productService.searchProductByAnyField(
      term,
      lang!,
      pagination!
    );
  }

  @UseGuards(AuthJwt, AdminGuard)
  @Get("admin")
  @ApiBearerAuth("token")
  @ApiOperation({ summary: "Get all products (Admin)" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: "Successfully fetched all products",
  })
  findAllForAdmin(
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    const pagination =
      page && limit ? { page: +page, limit: +limit } : undefined;
    return this.productService.findAllForAdmin(pagination);
  }

  @Get(":id")
  @ApiHeader({
    name: "lang",
    description: "Language ID (e.g., 1 for English, 2 for Spanish)",
    required: true,
    example: "1",
  })
  @ApiOperation({ summary: "Get product by ID" })
  @ApiResponse({ status: 200, description: "Product retrieved successfully" })
  findOne(
    @Param("id", ParseIntPipe) id: number,
    @CurrentLanguage() languageId?: string
  ) {
    return this.productService.findOne(
      id,
      languageId ? +languageId : undefined
    );
  }

  @Get("category/:id")
  @ApiHeader({
    name: "lang",
    description: "Language ID (e.g., 1 for English, 2 for Spanish)",
    required: true,
    example: "1",
  })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiOperation({ summary: "Get products by category" })
  @ApiResponse({ status: 200, description: "Products retrieved successfully" })
  getProductByCategory(
    @Param("id") id: string,
    @CurrentLanguage() languageId: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string
  ) {
    return this.productService.getProductByCategory(
      +id,
      +languageId,
      page && limit ? { page: +page, limit: +limit } : undefined
    );
  }

  @Get()
  @ApiOperation({ summary: "Get all products" })
  @ApiHeader({
    name: "lang",
    description: "Language ID (e.g., 1 for English, 2 for Spanish)",
    required: true,
    example: "1",
  })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: "Successfully retrieved all products",
  })
  findAllForUser(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @CurrentLanguage() languageId?: string
  ) {
    const lang = languageId ? +languageId : undefined;
    const pagination =
      page && limit ? { page: +page, limit: +limit } : undefined;

    return this.productService.findAllForUser(lang, pagination);
  }

  @UseGuards(AuthJwt, AdminGuard)
  @Patch(":id")
  @ApiBearerAuth("token")
  @ApiOperation({ summary: "Update a product" })
  @ApiResponse({ status: 200, description: "Product updated successfully" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Updated product data including images",
    type: UpdateProductDto,
  })
  @UseInterceptors(FileInterceptor("images"))
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() images?: any
  ) {
    if (images) {
      updateProductDto.images = await this.fileUploadService.saveFile(images);
    }
    return this.productService.update(id, updateProductDto);
  }

  @UseGuards(AuthJwt, AdminGuard)
  @Patch(":id/translation/:languageId")
  @ApiBearerAuth("token")
  @ApiOperation({ summary: "Update product translation" })
  @ApiResponse({
    status: 200,
    description: "Product translation updated successfully",
  })
  updateTranslation(
    @Param("id", ParseIntPipe) id: number,
    @Param("languageId", ParseIntPipe) languageId: number,
    @Body() updateProductTranslationDto: UpdateProductTranslationDto
  ) {
    return this.productService.updateTranslation(
      id,
      languageId,
      updateProductTranslationDto
    );
  }

  @UseGuards(AuthJwt, AdminGuard)
  @Post(":id/translation")
  @ApiBearerAuth("token")
  @ApiOperation({ summary: "Add product translation" })
  @ApiResponse({
    status: 201,
    description: "Product translation added successfully",
  })
  addTranslation(
    @Param("id", ParseIntPipe) id: number,
    @Body() createProductTranslationDto: CreateProductTranslationDto
  ) {
    return this.productService.addProductTranslation(
      id,
      createProductTranslationDto
    );
  }

  @UseGuards(AuthJwt, AdminGuard)
  @Delete(":id")
  @ApiBearerAuth("token")
  @ApiOperation({ summary: "Delete product" })
  @ApiResponse({ status: 200, description: "Product deleted successfully" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
