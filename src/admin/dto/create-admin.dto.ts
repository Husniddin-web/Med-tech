import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateAdminDto {
  @ApiProperty({ description: "Admin's full name" })
  @IsString()
  name: string;

  @ApiProperty({
    description: "Admin's email address",
    example: "admin@example.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "Admin's password", minLength: 6 })
  @MinLength(6)
  @IsString()
  password: string;
}
