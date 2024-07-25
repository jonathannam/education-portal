import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvironmentConfiguration } from './app/infrastructures/config';
import { AppModule } from './app/app.module';
import { TypeOrmErrorExceptionFilter } from './app/infrastructures/exceptions';
import { BadRequestExceptionFilter } from './app/infrastructures/exceptions/bad-request-exception.filter';

function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Nestjs Conduit')
    .setDescription('Nestjs Conduit API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
}

function configureApp(app: INestApplication): void {
  app.enableCors({ origin: 'http://localhost:4200' });
  app.useGlobalFilters(
    new TypeOrmErrorExceptionFilter(),
    new BadRequestExceptionFilter(),
  );
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<EnvironmentConfiguration>);
  configureApp(app);
  setupSwagger(app);
  await app.listen(configService.get('listeningPort', { infer: true }));
}

bootstrap();
