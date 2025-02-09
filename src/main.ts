import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {LoggingInterceptor} from "./interceptors/logging.interceptor";
import {ValidationPipe} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {join} from 'path';
import * as express from 'express';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT') || 5000;

    app.setGlobalPrefix('api');
    app.useGlobalInterceptors(new LoggingInterceptor());
    app.useGlobalPipes(new ValidationPipe({transform: true}));
    app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

    await app.listen(port);
}

bootstrap();
