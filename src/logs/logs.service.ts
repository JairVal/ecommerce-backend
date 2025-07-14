import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogDocument } from './log.schema';

@Injectable()
export class LogsService {
  constructor(
    @InjectModel(Log.name) private readonly logModel: Model<LogDocument>
  ) {}

  async create(createLogDto: { usuario: string; accion: string; descripcion?: string }): Promise<Log> {
    const createdLog = new this.logModel(createLogDto);
    return createdLog.save();
  }

  async findAll(): Promise<Log[]> {
    return this.logModel.find().exec();
  }
}
