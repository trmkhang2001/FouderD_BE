import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { json, urlencoded, type Request, type Response, type NextFunction } from 'express';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/** Khi client gửi nhầm body dạng JSON string (hoặc double-stringify), express.json() parse ra string → Zod báo expected object. */
function coerceStringJsonBody(req: Request, _res: Response, next: NextFunction) {
  const b = req.body;
  if (b != null && typeof b === 'string') {
    try {
      let parsed: unknown = JSON.parse(b);
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
      if (
        parsed !== null &&
        typeof parsed === 'object' &&
        !Array.isArray(parsed)
      ) {
        req.body = parsed;
      }
    } catch {
      /* giữ nguyên */
    }
  }
  next();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  const config = app.get(ConfigService);
  app.use(cookieParser());
  app.use(json({ limit: '2mb' }));
  app.use(urlencoded({ extended: true, limit: '2mb' }));
  app.use(coerceStringJsonBody);
  app.setGlobalPrefix('api');
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
