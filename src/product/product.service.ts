import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { UpdateProductTranslationDto } from "./dto/update-translation-product.dto";
import { CreateProductTranslationDto } from "./dto/create-product-translation.dto";

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    const languageIds = dto.translations?.map((t) => t.languageId);
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
    const isExistCategory = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!isExistCategory) {
      throw new BadRequestException("CategoryId is not found ");
    }

    return await this.prisma.product.create({
      data: {
        categoryId: dto.categoryId,
        images: dto.images!,
        translations: { create: dto.translations },
      },
      include: { translations: true },
    });
  }

  async findAllForAdmin() {
    return await this.prisma.product.findMany({
      include: {
        Order: true,
        translations: true,
        category: { select: { translations: true } },
      },
    });
  }

  async findAllForUser(languageId?: number) {
    const products = await this.prisma.product.findMany({
      include: {
        translations: languageId ? { where: { languageId } } : true,
        category: {
          include: {
            translations: languageId ? { where: { languageId } } : true,
          },
        },
      },
    });

    return products.map((p) => {
      const translation = p.translations[0] || {};
      const categoryTranslation = p.category?.translations[0] || {};

      return {
        id: p.id,
        categoryId: p.categoryId,
        categoryName: categoryTranslation.name || null,
        images: p.images,
        name: translation.name || null,
        description: translation.description || null,
        languageId,
      };
    });
  }

  async findOne(id: number, languageId?: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        Order: true,
        translations: languageId ? { where: { languageId } } : true,
        category: {
          include: {
            translations: languageId ? { where: { languageId } } : true,
          },
        },
      },
    });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    const translation = product.translations[0] || {};
    const categoryTranslation = product.category?.translations[0] || {};

    return {
      id: product.id,
      categoryId: product.categoryId,
      categoryName: categoryTranslation.name || null,
      images: product.images,
      name: translation.name || null,
      description: translation.description || null,
      languageId,
      order: product.Order,
    };
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findOne(id);

    const updateData: any = {};

    if (!dto) {
      throw new BadRequestException("Nothing is provided");
    }

    if (dto.images) {
      updateData.images = dto.images;
    }

    if (dto.categoryId) {
      const isExit = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!isExit) {
        throw new NotFoundException("Category id is not found");
      }
      updateData.categoryId = dto.categoryId;
    }

    return await this.prisma.product.update({
      where: { id },
      data: updateData,
      include: { translations: true },
    });
  }

  async updateTranslation(
    id: number,
    languageId: number,
    dto: UpdateProductTranslationDto
  ) {
    await this.findOne(id);

    const existingTranslation = await this.prisma.productTranslation.findUnique(
      {
        where: { productId_languageId: { productId: id, languageId } },
      }
    );

    if (!existingTranslation) {
      return await this.prisma.productTranslation.create({
        data: {
          name: dto.name,
          description: dto.description,
          languageId: languageId,
          productId: id,
        },
      });
    }

    return await this.prisma.productTranslation.update({
      where: { productId_languageId: { productId: id, languageId } },
      data: { name: dto.name, description: dto.description },
    });
  }

  async addProductTranslation(id: number, dto: CreateProductTranslationDto) {
    await this.findOne(id);

    const isLangExist = await this.prisma.language.findUnique({
      where: { id: dto.languageId },
    });

    if (!isLangExist) {
      throw new BadRequestException("Language is not exist");
    }

    // Check if translation already exists
    const existingTranslation = await this.prisma.productTranslation.findUnique(
      {
        where: {
          productId_languageId: {
            productId: id,
            languageId: dto.languageId,
          },
        },
      }
    );

    if (existingTranslation) {
      throw new BadRequestException(
        `Translation for language #${dto.languageId} already exists for this product`
      );
    }

    return await this.prisma.productTranslation.create({
      data: {
        name: dto.name,
        description: dto.description,
        languageId: dto.languageId,
        productId: id,
      },
    });
  }

  // ✅ Delete product
  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.product.delete({ where: { id } });
  }

  async searchProductByAnyField(field: string, lang: number) {
    return await this.prisma.product.findMany({
      where: {
        translations: {
          some: {
            languageId: lang,
            OR: [
              { name: { contains: field, mode: "insensitive" } },
              { description: { contains: field, mode: "insensitive" } },
            ],
          },
        },
      },
      include: {
        translations: { where: { languageId: lang } },
        category: {
          include: {
            translations: { where: { languageId: lang } },
          },
        },
      },
    });
  }
}
