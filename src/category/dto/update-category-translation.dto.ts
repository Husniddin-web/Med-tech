import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString } from "class-validator";

export class UpdateCategoryTranslationDto {
	@ApiPropertyOptional({ description: "Updated category name", example: "Electronics" })
	@IsOptional()
	@IsString()
	name?: string;

	@ApiPropertyOptional({ description: "Updated language ID", example: 1 })
	@IsOptional()
	@IsInt()
	languageId?: number;
}
