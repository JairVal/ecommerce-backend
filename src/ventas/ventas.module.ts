import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from './venta.entity';
import { DetalleVenta } from './detalle-venta.entity';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { Cliente } from '../clientes/cliente.entity';
import { Usuario } from '../usuarios/usuario.entity';
import { Producto } from '../productos/producto.entity';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Venta, DetalleVenta, Cliente, Usuario, Producto]),
    LogsModule,
  ],
  providers: [VentasService],
  controllers: [VentasController],
})
export class VentasModule {}
