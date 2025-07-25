import * as fs from 'fs';
import * as path from 'path';
import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from '../services/movie.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from 'src/models/movie.entity';
import { Repository } from 'typeorm';

const mockmovieRepo = {
  find: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  })),
  save: jest.fn(),
};

describe('MovieService', () => {
  let service: MovieService;
  let movieRepo: Repository<Movie>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: getRepositoryToken(Movie),
          useValue: mockmovieRepo,
        },
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);
    movieRepo = module.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar os dados de intervalo exatamente como no arquivo padrão', async () => {
    // ✅ mock dos vencedores
    mockmovieRepo.find.mockResolvedValue([
      { producers: 'Joel Silver', year: 1990, winner: true } as Movie,
      { producers: 'Joel Silver', year: 1991, winner: true } as Movie,
      { producers: 'Matthew Vaughn', year: 2002, winner: true } as Movie,
      { producers: 'Matthew Vaughn', year: 2015, winner: true } as Movie,
    ]);

    // ✅ leitura do resultado esperado
    const expected = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, 'expected-intervals.json'),
        'utf8'
      )
    );

    // ✅ chamada da service
    const resultado = await service.getMaxMinWinIntervalForProducers();

    // ✅ verificação
    expect(resultado).toEqual(expected);
  });
});