import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { Swagger } from "./constants/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle(Swagger.appTitle)
    .setDescription(Swagger.appDescription)
    .setVersion(Swagger.appVersion)
    .addTag(Swagger.apiTags.auth)
    .addTag(Swagger.apiTags.users)
    .addTag(Swagger.apiTags.ingredients)
    .addTag(Swagger.apiTags.recipes)
    .addTag(Swagger.apiTags.tags)
    .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" }, "accessToken")
    .build();

  const SwaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(Swagger.mountPoint, app, SwaggerDocument);

  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
