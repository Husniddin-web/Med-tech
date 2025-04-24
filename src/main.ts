import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { WinstonModule } from "nest-winston";
import { winstonConfig } from "./common/logger";
import { BadRequestException, Logger, ValidationPipe } from "@nestjs/common";
import { AllExceptionsFilter } from "./common/error/error.handling";
import * as cookieParser from "cookie-parser";
import { ResponseFormatInterceptor } from "./common/interceptor/response-format.interceptor";
import { seedSuperAdmin } from "./common/scripts/seed-admin";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  const options = new DocumentBuilder()
    .setTitle("Medicine")
    .setDescription("API documentation for Medicine platform")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        in: "header",
      },
      "token"
    )
    .build();
  app.setGlobalPrefix("api");

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api/docs", app, document);

  app.setGlobalPrefix("api");
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:8077",
        "http://localhost:3000",
        "http://3.122.24.252:3002/api/docs",
        "http://localhost:3002",
        "https://med-tech-next.netlify.app",
        "https://berlinmed-export.com",
        "https://api.berlinmed-export.com",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new BadRequestException("Not allowed by CORS"));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );
  app.useGlobalInterceptors(new ResponseFormatInterceptor());

  app.use(cookieParser());
  await seedSuperAdmin();
  const PORT = process.env.PORT || 3030;
  await app.listen(PORT, () => {
    console.log("Server running port at", PORT);
  });
}
bootstrap();
