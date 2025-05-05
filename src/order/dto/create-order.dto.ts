import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import {
  IsString,
  IsOptional,
  IsInt,
  IsEmail,
  IsEnum,
  Min,
  IsPhoneNumber,
} from "class-validator";

export class CreateOrderDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  productId: number;

  @ApiProperty({ example: "Acme Corp" })
  @IsString()
  company: string;

  @ApiProperty({ example: "+1-202-555-0143" })
  @IsString()
  phone: string;

  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "bulk" })
  @IsString()
  type: string;

  @ApiProperty({ example: "Office Chairs Order" })
  @IsString()
  title: string;

  @ApiProperty({ example: "Need 50 ergonomic chairs delivered by May." })
  @IsString()
  content: string;

  @ApiProperty({ example: 1234 })
  @IsInt()
  @Min(0)
  code: number;

  @ApiPropertyOptional({
    enum: Status,
    default: Status.START,
    example: Status.START,
  })
  @IsOptional()
  @IsEnum(Status)
  status: Status = Status.START;
}
