import { BadRequestException } from "@nestjs/common";
import { CreateProductTranslationDto } from "./create-product-translation.dto";
import { IsArray, IsOptional, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateProductDto {
	@ApiProperty({
		description: "Category ID to which the product belongs",
		example: 1,
	})
	@Type(() => Number)
	categoryId: number;

	@ApiPropertyOptional({
		description: "Product images (comma-separated URLs or file paths)",
		type: "string",
		format: "binary",
	})
	@IsOptional()
	images?: string;

	@ApiProperty({
		description: "Product translations",
		type: CreateProductTranslationDto,
		example: [
			{
				name: "Gaming Laptop",
				description: "High-performance laptop with RTX 3080",
				languageId: 2,
			},
			{
				name: "Ordenador Gaming",
				description: "Portátil de alto rendimiento con RTX 3080",
				languageId: 3,
			},
		],
	})
	translations: CreateProductTranslationDto[];
}
