import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configDotenv } from 'dotenv';
import dynamodb from 'dynamo/dynamodb';

configDotenv();

async function bootstrap() {
  await dynamodb.createTableIfNotExists();
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
