import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './cliente.entity';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { LogsModule } from '../logs/logs.module'; 

@Module({
  imports: [TypeOrmModule.forFeature([Cliente]),LogsModule],
  providers: [ClientesService],
  controllers: [ClientesController],
})
export class ClientesModule {}
