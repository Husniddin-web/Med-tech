import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { Transform } from "class-transformer";

export class CreateLanguageDto {
	@ApiProperty({
		description: "Language name",
		example: "eng",
	})
	@IsString()
	@Transform(({ value }) => value.toLowerCase())
	name: string;
}
