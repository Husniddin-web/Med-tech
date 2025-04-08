import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateLanguageDto } from "./dto/create-language.dto";
import { UpdateLanguageDto } from "./dto/update-language.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class LanguageService {
	constructor(private prisma: PrismaService) {}

	async create(dto: CreateLanguageDto) {
		const isExist = await this.prisma.language.findUnique({ where: { name: dto.name } });
		if (isExist) {
			throw new BadRequestException("Language already exist");
		}
		return this.prisma.language.create({ data: dto });
	}

	findAll() {
		return this.prisma.language.findMany({});
	}

	async findOne(id: number) {
		const lang = await this.prisma.language.findUnique({
			where: { id },
		});
		if (!lang) {
			throw new NotFoundException("Language not found");
		}
		return lang;
	}

	async update(id: number, updateLanguageDto: UpdateLanguageDto) {
		await this.findOne(id);

		if (!updateLanguageDto) {
			throw new BadRequestException();
		}

		const isExist = await this.prisma.language.findUnique({
			where: { name: updateLanguageDto.name },
		});

		if (isExist) {
			throw new BadRequestException("Language Laready exist");
		}

		return this.prisma.language.update({ where: { id }, data: updateLanguageDto });
	}

	async remove(id: number) {
		await this.findOne(id);
		await this.prisma.language.delete({ where: { id } });
		return "Language deleted";
	}
}
