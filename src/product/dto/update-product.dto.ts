import { PartialType } from "@nestjs/mapped-types";
import { CreateProductDto } from "./create-product.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class UpdateProductDto {
  @ApiPropertyOptional({
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
}
