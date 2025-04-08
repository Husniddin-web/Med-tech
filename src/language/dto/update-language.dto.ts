import { PartialType } from "@nestjs/mapped-types";
import { CreateLanguageDto } from "./create-language.dto";
import { IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateLanguageDto {
	@ApiPropertyOptional({
		description: "Language name",
		example: "eng",
	})
	@IsOptional()
	@IsString()
	@Transform(({ value }) => value.toLowerCase())
	name: string;
}
