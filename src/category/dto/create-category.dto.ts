import { BadRequestException } from "@nestjs/common";
import { CreateCategoryTranslationDto } from "./category-translation.dto";
import { IsArray, IsOptional, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCategoryDto {
	@ApiPropertyOptional({
		description: "Category logo file",
		type: "string",
		format: "binary",
	})
	@IsOptional()
	logo?: any;

	@ApiProperty({
		description: "Category translations",
		type: CreateCategoryTranslationDto,
		example: [
			{
				name: "Electronics",
				languageId: 2,
			},
			{
				name: "Electronics",
				languageId: 3,
			},
		],
	})
	translations: CreateCategoryTranslationDto[];
}
