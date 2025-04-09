import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength } from "class-validator";

export class CreateContactDto {
  @ApiProperty({ example: "John" })
  @IsString()
  name: string;

  @ApiProperty({ example: "example@gmail.coms" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "dadasdadasdsa" })
  @IsString()
  @MaxLength(150)
  message: string;
}
