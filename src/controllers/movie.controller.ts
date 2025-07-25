import { Controller, Get, HttpCode } from "@nestjs/common";
import { MovieService } from "src/services/movie.service";

@Controller("/movie")
export class MovieController {

  constructor(
    private movie: MovieService
  ) { }

  // Producers with longest and shortest interval between wins
  @Get("/maxMinWinIntervalForProducers")
  @HttpCode(200)
  async getIntervalos() {
    return this.movie.getMaxMinWinIntervalForProducers();
  }
}