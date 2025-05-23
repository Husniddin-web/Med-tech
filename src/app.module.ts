import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { PrismaModule } from "./prisma/prisma.module";
import { FileUploadModule } from "./file-upload/file-upload.module";
import { MailModule } from "./mail/mail.module";
import { LanguageModule } from "./language/language.module";
import { AdminModule } from "./admin/admin.module";
import { ProductModule } from "./product/product.module";
import { AuthModule } from "./auth/auth.module";
import { CategoryModule } from "./category/category.module";
import { OrderModule } from "./order/order.module";
import { ContactModule } from "./contact/contact.module";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "upload"),
      serveStaticOptions: {
        index: false,
      },
    }),
    PrismaModule,
    FileUploadModule,
    MailModule,
    LanguageModule,
    AdminModule,
    ProductModule,
    AuthModule,
    CategoryModule,
    OrderModule,
    ContactModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
