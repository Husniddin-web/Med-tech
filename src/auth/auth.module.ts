import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { MailModule } from "../mail/mail.module";
import { RefreshTokenStrategy } from "./strategy/refresh-token.strategy";
import { JwtAuth } from "./strategy/auth-jwt.strategy";
import { AdminModule } from "../admin/admin.module";

@Module({
  imports: [
    PrismaModule,
    AdminModule,
    MailModule,
    JwtModule.register({ global: true }),
  ],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenStrategy, JwtAuth],
  exports: [AuthService],
})
export class AuthModule {}
