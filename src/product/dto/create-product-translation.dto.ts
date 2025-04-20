import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, IsNumber } from "class-validator";

export class CreateProductTranslationDto {
  @ApiProperty({
    description: "Name of the product translation",
    example: "Laptop",
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "Description of the product translation",
    example: "High-performance gaming laptop",
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: "ID of the language for translation",
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  languageId: number;
}
