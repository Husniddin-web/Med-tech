import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { FileUploadModule } from "../file-upload/file-upload.module";
import { JwtAuth } from "../auth/strategy/auth-jwt.strategy";
import { ProductService } from "./product.service";

@Module({
  imports: [PrismaModule, FileUploadModule],
  controllers: [ProductController],
  providers: [ProductService, JwtAuth],
})
export class ProductModule {}
