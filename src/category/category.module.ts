import { Module } from "@nestjs/common";
import { CategoryController } from "./category.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { FileUploadModule } from "../file-upload/file-upload.module";
import { CategoryService } from "./category.service";

@Module({
  imports: [PrismaModule, FileUploadModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
