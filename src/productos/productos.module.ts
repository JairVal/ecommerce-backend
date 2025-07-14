import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './producto.entity';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Categoria } from '../categorias/categoria.entity';
import { Proveedor } from '../proveedor/proveedor.entity';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto, Categoria, Proveedor]),
    LogsModule,
  ],
  providers: [ProductosService],
  controllers: [ProductosController],
})
export class ProductosModule {}
