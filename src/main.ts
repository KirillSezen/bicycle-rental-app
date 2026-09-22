import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExceptionsFilter } from './common/exceptions.filter';

async function start(): Promise<void> {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const customErrors = validationErrors.map((error) => ({
          field: error.property,
          error: Object.values(error.constraints || {}).join('; '),
        }));

        return new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: customErrors,
        });
      },
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new ExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('Bicycle Rental App')
    .setDescription('Документация приложения')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(PORT, () => console.log(`Server started at ${PORT}`));
}

void start();
