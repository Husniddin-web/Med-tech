import { IsOptional, IsString } from "class-validator";

export class UpdateProductTranslationDto {
	@IsOptional()
	@IsString()
	name: string;

	@IsOptional()
	@IsString()
	description: string;
}
