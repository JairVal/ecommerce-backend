import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // <-- ¡ESTO ES CLAVE!
  await app.listen(3103); // o el puerto que uses
}

bootstrap();
