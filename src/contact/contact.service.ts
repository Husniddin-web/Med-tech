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

  findAll() {
    return this.prisma.contact.findMany();
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
