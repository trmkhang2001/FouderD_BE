import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors({
    origin: config.get<string>('FRONTEND_ORIGIN') ?? 'http://localhost:3000',
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('ERP Pro API')
    .setDescription('Swagger documentation for ERP Pro backend')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  // Note: swagger routes are not affected by `app.setGlobalPrefix('api')`,
  // so we mount them explicitly under `/api`.
  SwaggerModule.setup('api/swagger', app, document);

  const port = config.get<number>('PORT') ?? 4000;
  // Ràng buộc IPv4 để nginx proxy_pass http://127.0.0.1:4000 luôn kết nối được trên VPS
  await app.listen(port, '0.0.0.0');
}
bootstrap();
