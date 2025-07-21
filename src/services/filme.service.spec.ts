import { Test, TestingModule } from '@nestjs/testing';
import { FilmeService } from './filme.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Filme } from 'src/models/filme.entity';
import { Repository } from 'typeorm';

const mockFilmeRepo = {
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

describe('FilmeService', () => {
  let service: FilmeService;
  let filmeRepo: Repository<Filme>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmeService,
        {
          provide: getRepositoryToken(Filme),
          useValue: mockFilmeRepo,
        },
      ],
    }).compile();

    service = module.get<FilmeService>(FilmeService);
    filmeRepo = module.get<Repository<Filme>>(getRepositoryToken(Filme));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar filmes com paginação', async () => {
    mockFilmeRepo.createQueryBuilder.mockReturnValue({
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([
        [{ id: 1, title: 'Teste', year: 2000, winner: true, producers: '', studios: '' }],
        1
      ]),
    });

    const result = await service.listarFilmesComFiltro({ page: 1 });
    expect(result.total).toBe(1);
    expect(result.data[0].title).toBe('Teste');
  });

  it('deve retornar os anos com múltiplos vencedores', async () => {
    mockFilmeRepo.find.mockResolvedValue([
      { year: 2000, winner: true } as Filme,
      { year: 2000, winner: true } as Filme,
      { year: 2001, winner: true } as Filme,
    ]);

    const result = await service.getYearsWithMultipleWinners();
    expect(result).toEqual([{ year: 2000, winCount: 2 }]);
  });

  it('deve retornar os 3 principais estúdios com mais vitórias', async () => {
    mockFilmeRepo.find.mockResolvedValue([
      { studios: 'A', winner: true } as Filme,
      { studios: 'B, A', winner: true } as Filme,
      { studios: 'C, A', winner: true } as Filme,
      { studios: 'C', winner: true } as Filme,
    ]);

    const result = await service.getTopStudios();
    expect(result[0].name).toBe('A');
    expect(result[0].winCount).toBe(3);
  });

  it('deve retornar vencedores de um ano específico', async () => {
    const mockData = [{ id: 1, year: 2000, title: 'Filme A' }];
    mockFilmeRepo.find.mockResolvedValue(mockData as Filme[]);

    const result = await service.getWinners(2000);
    expect(result).toEqual(mockData);
    expect(filmeRepo.find).toHaveBeenCalledWith({
      where: { year: 2000, winner: true },
      select: ['id', 'year', 'title'],
      order: { title: 'ASC' },
    });
  });

  it('deve calcular intervalo entre prêmios', async () => {
    mockFilmeRepo.find.mockResolvedValue([
      { producers: 'Produtor A', year: 2000, winner: true } as Filme,
      { producers: 'Produtor A', year: 2005, winner: true } as Filme,
      { producers: 'Produtor A and Produtor B', year: 2010, winner: true } as Filme,
    ]);

    const result = await service.getIntervalosPremios();
    expect(result.min[0].interval).toBe(5);
    expect(result.max[0].interval).toBe(5);
  });
});
