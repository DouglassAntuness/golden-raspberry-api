import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Models
import { Movie } from './models/movie.entity';

// Services
import { MovieController } from './controllers/movie.controller';

// Controllers
import { MovieService } from './services/movie.service';
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
      entities: [Movie],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Movie]),
  ],
  controllers: [
    AppController,
    MovieController
  ],
  providers: [
    MovieService
  ],
})
export class AppModule { }
