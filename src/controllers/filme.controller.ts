import { Controller, Get, HttpCode } from "@nestjs/common";
import { FilmeService } from "src/services/filme.service";

@Controller("/filme")
export class FilmeController {

  constructor(
    private filme: FilmeService
  ) { }

  // Combo status obra
  @Get("/producers/intervals")
  @HttpCode(200)
  async getIntervalos() {
    return this.filme.getIntervalosPremios();
  }
}