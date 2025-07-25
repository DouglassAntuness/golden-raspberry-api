import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const linksCors = [
    'http://localhost:8000',
    'http://localhost:8082',
    'http://localhost:3333',
    'http://localhost:3000',
  ]

  // Habilitando CORS
  app.enableCors({
    origin: linksCors,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // se você estiver usando cookies, por exemplo
  });

  // Configura o limite de tamanho da requisição
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  
  await app.listen(8000, '0.0.0.0');

}
bootstrap();