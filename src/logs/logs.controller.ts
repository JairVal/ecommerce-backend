import { Controller, Post, Body, Get } from '@nestjs/common';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post()
  create(@Body() createLogDto: { usuario: string; accion: string; descripcion?: string }) {
    return this.logsService.create(createLogDto);
  }

  @Get()
  findAll() {
    return this.logsService.findAll();
  }
}
