"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = require("express");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
function coerceStringJsonBody(req, _res, next) {
    const b = req.body;
    if (b != null && typeof b === 'string') {
        try {
            let parsed = JSON.parse(b);
            if (typeof parsed === 'string') {
                parsed = JSON.parse(parsed);
            }
            if (parsed !== null &&
                typeof parsed === 'object' &&
                !Array.isArray(parsed)) {
                req.body = parsed;
            }
        }
        catch {
        }
    }
    next();
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bodyParser: false });
    const config = app.get(config_1.ConfigService);
    app.use((0, cookie_parser_1.default)());
    app.use((0, express_1.json)({ limit: '2mb' }));
    app.use((0, express_1.urlencoded)({ extended: true, limit: '2mb' }));
    app.use(coerceStringJsonBody);
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: config.get('FRONTEND_ORIGIN') ?? 'http://localhost:3000',
        credentials: true,
    });
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('ERP Pro API')
        .setDescription('Swagger documentation for ERP Pro backend')
        .setVersion('1.0.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api/swagger', app, document);
    const port = config.get('PORT') ?? 4000;
    await app.listen(port, '0.0.0.0');
}
bootstrap();
//# sourceMappingURL=main.js.map