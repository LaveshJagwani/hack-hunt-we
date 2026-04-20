import compression from 'compression';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port', 3000);

  app.setGlobalPrefix('api/v1');
  app.use(helmet());
  app.use(compression());
  app.enableCors({
    origin: configService.get<string[]>('app.corsOrigins', []),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const docsConfig = new DocumentBuilder()
    .setTitle('HackHunt API')
    .setDescription('Hackathon discovery and aggregation backend API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, docsConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  await app.listen(port);
}

void bootstrap();
