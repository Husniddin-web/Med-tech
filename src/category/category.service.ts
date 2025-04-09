import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateCategoryTranslationDto } from "./dto/update-category-translation.dto";
import { CreateCategoryTranslationDto } from "./dto/category-translation.dto";

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    const languageIds = dto.translations?.map((t) => t["languageId"]);
    const existingLanguages = await this.prisma.language.findMany({
      where: { id: { in: languageIds } },
      select: { id: true },
    });

    const existingLanguageIds = new Set(
      existingLanguages.map((lang) => lang.id)
    );
    const invalidLanguageIds = languageIds!.filter(
      (id) => !existingLanguageIds.has(id)
    );

    if (invalidLanguageIds.length > 0) {
      throw new BadRequestException(
        `Invalid languageId(s): ${invalidLanguageIds.join(", ")}`
      );
    }
    for (const translation of dto.translations) {
      console.log(translation);
      const existingTranslation =
        await this.prisma.categoryTranslation.findFirst({
          where: {
            name: { equals: translation.name, mode: "insensitive" },
            languageId: translation.languageId,
          },
        });

      if (existingTranslation) {
        throw new BadRequestException(
          `Translation already exists for category languageId=${translation.languageId}`
        );
      }
    }

    return await this.prisma.category.create({
      data: {
        logo: dto.logo,
        translations: {
          create: dto.translations,
        },
      },
      include: { translations: true },
    });
  }

  async findAll() {
    return await this.prisma.category.findMany({
      include: { translations: true, products: true },
    });
  }

  async findAllByLang(languageId?: number) {
    const categories = await this.prisma.category.findMany({
      include: {
        products: true,
        translations: {
          where: languageId ? { languageId } : {},
        },
      },
    });

    return categories.map((category) => {
      const translation = category.translations[0] || {};
      return {
        id: category.id,
        logo: category.logo,
        name: translation.name || null,
        products: category.products,
        languageId,
      };
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { translations: true, products: true },
    });

    if (!category) throw new NotFoundException(`Category #${id} not found`);

    return category;
  }

  async findOneByLang(id: number, languageId: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        translations: {
          where: languageId ? { languageId } : {},
        },
        products: true,
      },
    });

    if (!category) throw new NotFoundException(`Category #${id} not found`);

    const translation = category.translations[0] || {};

    return {
      id: category.id,
      logo: category.logo,
      name: translation.name || null,
      products: category.products,
      languageId,
    };
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    if (dto.logo) {
      return await this.prisma.category.update({
        where: { id },
        data: {
          logo: dto.logo,
        },
        include: { translations: true },
      });
    }
    return category;
  }

  async updateCategoryTranslation(
    id: number,
    languageId: number,
    dto: UpdateCategoryTranslationDto
  ) {
    await this.findOne(id);

    return await this.prisma.categoryTranslation.update({
      where: { categoryId_languageId: { categoryId: id, languageId } },
      data: { name: dto.name },
    });
  }

  async addCategoryTranslation(id: number, dto: CreateCategoryTranslationDto) {
    await this.findOne(id);

    const isLanguage = await this.prisma.language.findUnique({
      where: { id: dto.languageId },
    });

    if (!isLanguage) {
      throw new BadRequestException(
        `Language is not found with id #${dto.languageId}`
      );
    }
    const isExist = await this.prisma.categoryTranslation.findFirst({
      where: {
        languageId: dto.languageId,
        name: { equals: dto.name, mode: "insensitive" },
      },
    });

    if (isExist) {
      throw new BadRequestException("This translastion is already exist");
    }

    return await this.prisma.categoryTranslation.create({
      data: {
        name: dto.name.toLowerCase(),
        languageId: dto.languageId,
        categoryId: id,
      },
    });
  }

  async removeCategoryTranslation(id: number, languageId: number) {
    return await this.prisma.categoryTranslation.delete({
      where: {
        categoryId_languageId: { categoryId: id, languageId },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return await this.prisma.category.delete({
      where: { id },
    });
  }
}
