import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Filme } from 'src/models/filme.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';

@Injectable()
export class FilmeService implements OnModuleInit {
  constructor(
    @InjectRepository(Filme)
    // Injeção do repositório do TypeORM para acessar a tabela Filme
    private readonly filmeRepo: Repository<Filme>,
  ) { }

  // Este método é executado automaticamente quando o módulo é carregado
  async onModuleInit() {
    // Caminho absoluto do CSV usando o diretório raiz do projeto
    const filePath = path.join(process.cwd(), 'src/arquivos/movielist.csv');
    console.log(filePath); // Log para conferência do caminho do arquivo

    // Array para armazenar os filmes lidos do CSV
    const filmes: Filme[] = [];

    // Cria uma stream de leitura do CSV e utiliza o parser com separador ;
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';' }))
      .on('data', (data) => {
        // Para cada linha lida, cria um objeto Filme e adiciona no array
        filmes.push({
          year: Number(data.year),
          title: data.title,
          studios: data.studios,
          producers: data.producers,
          winner: data.winner?.toString().trim().toLowerCase() === 'yes',
        } as Filme);
      })
      .on('end', async () => {
        // Após a leitura de todos os dados, salva os filmes no banco
        await this.filmeRepo.save(filmes);
        console.log('CSV importado!');
      });
  }

  async listarFilmesComFiltro({
    page = 1,
    year,
    winner,
    title,
  }: {
    page: number;
    year?: number;
    winner?: string;
    title?: string;
  }) {
    // Define a quantidade de itens por página e calcula o deslocamento
    const take = 10;
    const skip = (page - 1) * take;

    const query = this.filmeRepo.createQueryBuilder('filme');

    // Aplica os filtros, se fornecido
    if (year) {
      query.andWhere('filme.year = :year', { year });
    }

    if (winner !== undefined) {
      if (winner.toLowerCase() === 'yes') {
        query.andWhere('filme.winner = true');
      } else if (winner.toLowerCase() === 'no') {
        query.andWhere('filme.winner = false');
      }
    }

    if (title) {
      query.andWhere('LOWER(filme.title) LIKE :title', {
        title: `%${title.toLowerCase()}%`,
      });
    }

    // Executa a consulta com ordenação, paginação e retorna os dados e total
    const [data, total] = await query
      .orderBy('filme.id', 'ASC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    // Retorna os dados paginados, total de itens e número de páginas
    return {
      data,
      total,
      page,
      pageCount: Math.ceil(total / take),
    };
  }


  async getIntervalosPremios() {
    // 1. Buscar apenas os filmes vencedores
    const vencedores = await this.filmeRepo.find({
      where: { winner: true },
    });

    const mapaProdutores: Record<string, number[]> = {};

    // 2. Organizar os anos de vitória por produtor
    for (const filme of vencedores) {
      const produtores = filme.producers
        .split(/,| and /) // quebra por vírgula ou " and "
        .map((p) => p.trim());

      for (const produtor of produtores) {
        if (!mapaProdutores[produtor]) {
          mapaProdutores[produtor] = [];
        }
        mapaProdutores[produtor].push(filme.year);
      }
    }

    const intervalos: {
      producer: string;
      interval: number;
      previousWin: number;
      followingWin: number;
    }[] = [];

    // 3. Calcular os intervalos entre prêmios consecutivos
    for (const [produtor, anos] of Object.entries(mapaProdutores)) {
      if (anos.length < 2) continue;

      const ordenados = anos.sort((a, b) => a - b);
      for (let i = 1; i < ordenados.length; i++) {
        intervalos.push({
          producer: produtor,
          interval: ordenados[i] - ordenados[i - 1],
          previousWin: ordenados[i - 1],
          followingWin: ordenados[i],
        });
      }
    }

    // 4. Descobrir os menores e maiores intervalos
    const minInterval = Math.min(...intervalos.map((i) => i.interval));
    const maxInterval = Math.max(...intervalos.map((i) => i.interval));

    return {
      min: intervalos.filter((i) => i.interval === minInterval),
      max: intervalos.filter((i) => i.interval === maxInterval),
    };
  }

  // Retorna os anos em que houve mais de um vencedor
  async getYearsWithMultipleWinners() {
    // Busca todos os filmes vencedores
    const vencedores = await this.filmeRepo.find({
      where: { winner: true },
    });

    const mapa: Record<number, number> = {};

    for (const f of vencedores) {
      mapa[f.year] = (mapa[f.year] || 0) + 1;
    }

    // Filtra os anos com mais de 1 vencedor e retorna como lista de objetos
    return Object.entries(mapa)
      .filter(([_, count]) => count > 1)
      .map(([year, count]) => ({
        year: Number(year),
        winCount: count,
      }));
  }

  // Retorna os 3 estúdios com mais vitórias
  async getTopStudios() {
    // Busca todos os filmes vencedores
    const vencedores = await this.filmeRepo.find({
      where: { winner: true },
    });

    const mapa: Record<string, number> = {};

    for (const f of vencedores) {
      const estudios = f.studios.split(',').map((e) => e.trim());
      for (const est of estudios) {
        mapa[est] = (mapa[est] || 0) + 1;
      }
    }

    // Converte para array, ordena decrescente e pega os 3 primeiros
    return Object.entries(mapa)
      .map(([name, count]) => ({ name, winCount: count }))
      .sort((a, b) => b.winCount - a.winCount)
      .slice(0, 3);
  }

  // Retorna todos os vencedores de um determinado ano
  async getWinners(ano: number) {
    return this.filmeRepo.find({
      where: {
        year: ano,
        winner: true,
      },
      select: ['id', 'year', 'title'],
      order: { title: 'ASC' },
    });
  }


}
