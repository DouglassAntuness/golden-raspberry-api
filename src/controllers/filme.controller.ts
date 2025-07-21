import { Controller, Get, HttpCode, Param, Query } from "@nestjs/common";
import { FilmeService } from "src/services/filme.service";

@Controller("/filme")
export class FilmeController {

  constructor(
    private filme: FilmeService
  ) { }

  // List all movies with pagination and filters
  @Get()
  async listarFilmes(
    @Query('page') page = 1,
    @Query('year') year?: number,
    @Query('winner') winner?: string,
    @Query('title') title?: string,
  ) {
    return this.filme.listarFilmesComFiltro({ page, year, winner, title });
  }

  // Producers with longest and shortest interval between wins
  @Get("/intervals")
  @HttpCode(200)
  async getIntervalos() {
    return this.filme.getIntervalosPremios();
  }

  // Top 3 studios with winners
  @Get("/top-studios")
  @HttpCode(200)
  async getTopStudios() {
    return this.filme.getTopStudios();
  }

  // List years with multiple winners
  @Get("/years-with-multiple-winners")
  @HttpCode(200)
  async getYearsWithMultipleWinners() {
    return this.filme.getYearsWithMultipleWinners();
  }

  // List movie winners by year
  @Get("/winners/:year")
  @HttpCode(200)
  async getWinners(@Param("year") year: number) {
    return this.filme.getWinners(year);
  }
}