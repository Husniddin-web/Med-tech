import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class SignInDto {
	@ApiProperty({ description: "User email address", example: "user@example.com" })
	@IsEmail()
	email: string;

	@ApiProperty({ description: "User password", minLength: 6 })
	@IsString()
	@MinLength(6)
	password: string;
}
