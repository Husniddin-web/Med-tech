import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const isProductExist = await this.prisma.product.findUnique({
      where: { id: createOrderDto.productId },
    });

    if (!isProductExist) {
      throw new NotFoundException("Product not found");
    }
    return this.prisma.order.create({
      data: createOrderDto,
    });
  }

  async findAll(pagination?: { page: number; limit: number }) {
    const { page, limit } = pagination || {};
    const skip = page && limit ? (page - 1) * limit : undefined;
    const take = page && limit ? limit : undefined;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        include: { product: { include: { translations: true } } },
        skip,
        take,
      }),
      this.prisma.order.count(),
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
    const data = await this.prisma.order.findUnique({
      where: { id },
      include: { product: { include: { translations: true } } },
    });
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    await this.findOne(id);
    return this.prisma.order.update({ where: { id }, data: updateOrderDto });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.order.delete({ where: { id } });
  }
}
