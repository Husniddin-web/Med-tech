import { Module } from "@nestjs/common";
import { LanguageService } from "./language.service";
import { PrismaModule } from "../prisma/prisma.module";
import { JwtAuth } from "../auth/strategy/auth-jwt.strategy";
import { LanguageController } from "./language.controller";

@Module({
	imports: [PrismaModule],
	controllers: [LanguageController],
	providers: [LanguageService, JwtAuth],
	exports: [LanguageService],
})
export class LanguageModule {}
