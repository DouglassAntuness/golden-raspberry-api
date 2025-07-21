import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Models
import { Filme } from './models/filme.entity';

// Services
import { FilmeController } from './controllers/filme.controller';

// Controllers
import { FilmeService } from './services/filme.service';
import { AppController } from './app.controller';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env"
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [Filme],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Filme]),
  ],
  controllers: [
    AppController,
    FilmeController
  ],
  providers: [
    FilmeService
  ],
})
export class AppModule { }
