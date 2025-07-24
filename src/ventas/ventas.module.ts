import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { Venta } from './venta.entity';
import { DetalleVenta } from './detalle-venta.entity';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';

import { Usuario } from '../usuarios/usuario.entity';
import { Producto } from '../productos/producto.entity';
import { LogsModule } from '../logs/logs.module';

import { Cliente, ClienteSchema } from '../clientes/schemas/cliente.schema'; // 👈 Mongo

@Module({
  imports: [
    TypeOrmModule.forFeature([Venta, DetalleVenta, Usuario, Producto]), // 👈 Cliente eliminado
    MongooseModule.forFeature([{ name: Cliente.name, schema: ClienteSchema }]), // 👈 MongoDB schema
    LogsModule,
  ],
  providers: [VentasService],
  controllers: [VentasController],
})
export class VentasModule {}
