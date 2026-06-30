import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeApp, cert } from 'firebase-admin/app';

async function bootstrap() {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (serviceAccount) {
    initializeApp({
      credential: cert(JSON.parse(serviceAccount)),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  } else {
    initializeApp();
  }

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
