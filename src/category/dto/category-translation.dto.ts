import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryTranslationDto {
	@ApiProperty({ description: "Category name", example: "Electronics" })
	@IsString()
	@IsNotEmpty()
	@Transform(({ value }) => value?.trim().toLowerCase())
	name: string;
	

	@ApiProperty({ description: "Language ID", example: 1 })
	@IsInt()
	languageId: number;
}
