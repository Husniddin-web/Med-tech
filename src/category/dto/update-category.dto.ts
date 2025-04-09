import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, ValidateNested, IsArray } from "class-validator";
import { Type } from "class-transformer";
import { CreateCategoryTranslationDto } from "./category-translation.dto";

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    description: "Updated category logo file",
    type: "string",
    format: "binary",
  })
  @IsOptional()
  logo?: any;
}
