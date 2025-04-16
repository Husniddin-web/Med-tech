import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateContactDto } from "./dto/create-contact.dto";
import { UpdateContactDto } from "./dto/update-contact.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  create(createContactDto: CreateContactDto) {
    return this.prisma.contact.create({ data: createContactDto });
  }

  async findAll(pagination?: { page: number; limit: number }) {
    const { page, limit } = pagination || {};
    const skip = page && limit ? (page - 1) * limit : undefined;
    const take = page && limit ? limit : undefined;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.contact.findMany({ skip, take }),
      this.prisma.contact.count(),
    ]);

    return page && limit
      ? {
          data,
          total,
          page,
          lastPage: Math.ceil(total / limit),
        }
      : data;
  }

  async findOne(id: number) {
    const data = await this.prisma.contact.findUnique({ where: { id } });
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }

  async update(id: number, updateContactDto: UpdateContactDto) {
    await this.findOne(id);
    return this.prisma.contact.update({
      where: { id },
      data: updateContactDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.contact.delete({ where: { id } });
  }
}
