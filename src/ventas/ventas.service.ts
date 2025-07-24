import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Repository } from 'typeorm';
import { Model, Types } from 'mongoose';

import { Venta } from './venta.entity';
import { DetalleVenta } from './detalle-venta.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';

import { Usuario } from '../usuarios/usuario.entity';
import { Producto } from '../productos/producto.entity';
import { LogsService } from '../logs/logs.service';

import { Cliente, ClienteDocument } from '../clientes/schemas/cliente.schema';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,

    @InjectRepository(DetalleVenta)
    private readonly detalleVentaRepository: Repository<DetalleVenta>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,

    @InjectModel(Cliente.name)
    private readonly clienteModel: Model<ClienteDocument>,

    private readonly logsService: LogsService,
  ) {}

  findAll(): Promise<Venta[]> {
    return this.ventaRepository.find();
  }

  async findOne(id: number): Promise<Venta> {
    const venta = await this.ventaRepository.findOne({ where: { id } });
    if (!venta) throw new NotFoundException(`Venta con id ${id} no encontrada`);
    return venta;
  }

  async create(data: CreateVentaDto): Promise<Venta> {
    const cliente = await this.clienteModel.findById(data.id_cliente);
    if (!cliente) throw new NotFoundException(`Cliente con id ${data.id_cliente} no encontrado`);

    const usuario = await this.usuarioRepository.findOne({ where: { id: data.id_usuario } });
    if (!usuario) throw new NotFoundException(`Usuario con id ${data.id_usuario} no encontrado`);

    const detalles: DetalleVenta[] = [];
    for (const detalleDto of data.detalles) {
      const producto = await this.productoRepository.findOne({ where: { id: detalleDto.id_producto } });
      if (!producto) throw new NotFoundException(`Producto con id ${detalleDto.id_producto} no encontrado`);

      const detalle = this.detalleVentaRepository.create({
        producto,
        cantidad: detalleDto.cantidad,
        subtotal: detalleDto.subtotal,
      });
      detalles.push(detalle);
    }

    const venta = this.ventaRepository.create({
      id_cliente: (cliente._id as Types.ObjectId).toString(), // ✅ solución correcta
      usuario,
      total: data.total,
      detalles,
    });

    const savedVenta = await this.ventaRepository.save(venta);

    await this.logsService.create({
      usuario: 'sistema',
      accion: 'creacion-venta',
      descripcion: `Venta ${savedVenta.id} creada para cliente ${cliente.nombre}`,
    });

    return savedVenta;
  }

  async remove(id: number): Promise<void> {
    const venta = await this.ventaRepository.findOne({ where: { id } });
    if (!venta) throw new NotFoundException(`Venta con id ${id} no encontrada`);

    await this.ventaRepository.delete(id);

    await this.logsService.create({
      usuario: 'sistema',
      accion: 'eliminacion-venta',
      descripcion: `Venta ${venta.id} eliminada`,
    });
  }

  async update(id: number, data: UpdateVentaDto): Promise<Venta> {
    const venta = await this.ventaRepository.findOne({ where: { id } });
    if (!venta) throw new NotFoundException(`Venta con id ${id} no encontrada`);

    if (data.id_cliente) {
      const cliente = await this.clienteModel.findById(data.id_cliente);
      if (!cliente) throw new NotFoundException(`Cliente con id ${data.id_cliente} no encontrado`);
      venta.id_cliente = (cliente._id as Types.ObjectId).toString(); // ✅ solución correcta
    }

    if (data.id_usuario) {
      const usuario = await this.usuarioRepository.findOne({ where: { id: data.id_usuario } });
      if (!usuario) throw new NotFoundException(`Usuario con id ${data.id_usuario} no encontrado`);
      venta.usuario = usuario;
    }

    if (data.total !== undefined) {
      venta.total = data.total;
    }

    if (data.detalles && data.detalles.length > 0) {
      await this.detalleVentaRepository.delete({ venta: { id: venta.id } });

      const nuevosDetalles: DetalleVenta[] = [];
      for (const detalleDto of data.detalles) {
        const producto = await this.productoRepository.findOne({ where: { id: detalleDto.id_producto } });
        if (!producto) throw new NotFoundException(`Producto con id ${detalleDto.id_producto} no encontrado`);

        const detalle = this.detalleVentaRepository.create({
          producto,
          cantidad: detalleDto.cantidad,
          subtotal: detalleDto.subtotal,
          venta,
        });
        nuevosDetalles.push(detalle);
      }

      venta.detalles = nuevosDetalles;
    }

    const updatedVenta = await this.ventaRepository.save(venta);

    await this.logsService.create({
      usuario: 'sistema',
      accion: 'actualizacion-venta',
      descripcion: `Venta ${updatedVenta.id} actualizada`,
    });

    return updatedVenta;
  }
}
