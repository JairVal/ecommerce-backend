import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Categoria } from '../categorias/categoria.entity';
import { Proveedor } from '../proveedor/proveedor.entity';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    @InjectRepository(Proveedor)
    private readonly proveedorRepository: Repository<Proveedor>,
    private readonly logsService: LogsService,
  ) {}

  findAll(): Promise<Producto[]> {
    return this.productoRepository.find();
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne({ where: { id } });
    if (!producto) throw new NotFoundException(`Producto con id ${id} no encontrado`);
    return producto;
  }

  async create(data: CreateProductoDto): Promise<Producto> {
    const categoria = await this.categoriaRepository.findOne({ where: { id: data.id_categoria } });
    if (!categoria) throw new NotFoundException(`Categoría con id ${data.id_categoria} no encontrada`);

    const proveedor = await this.proveedorRepository.findOne({ where: { id: data.id_proveedor } });
    if (!proveedor) throw new NotFoundException(`Proveedor con id ${data.id_proveedor} no encontrado`);

    const producto = this.productoRepository.create({
      ...data,
      categoria,
      proveedor,
    });
    const savedProducto = await this.productoRepository.save(producto);

    await this.logsService.create({
      usuario: 'sistema',
      accion: 'creacion-producto',
      descripcion: `Producto ${savedProducto.nombre} creado`,
    });

    return savedProducto;
  }

  async update(id: number, data: UpdateProductoDto): Promise<Producto> {
    const producto = await this.productoRepository.findOne({ where: { id } });
    if (!producto) throw new NotFoundException(`Producto con id ${id} no encontrado`);

    if (data.id_categoria) {
      const categoria = await this.categoriaRepository.findOne({ where: { id: data.id_categoria } });
      if (!categoria) throw new NotFoundException(`Categoría con id ${data.id_categoria} no encontrada`);
      producto.categoria = categoria;
    }

    if (data.id_proveedor) {
      const proveedor = await this.proveedorRepository.findOne({ where: { id: data.id_proveedor } });
      if (!proveedor) throw new NotFoundException(`Proveedor con id ${data.id_proveedor} no encontrado`);
      producto.proveedor = proveedor;
    }

    Object.assign(producto, data);
    const updatedProducto = await this.productoRepository.save(producto);

    await this.logsService.create({
      usuario: 'sistema',
      accion: 'actualizacion-producto',
      descripcion: `Producto ${updatedProducto.nombre} actualizado`,
    });

    return updatedProducto;
  }

  async remove(id: number): Promise<void> {
    const producto = await this.productoRepository.findOne({ where: { id } });
    if (!producto) throw new NotFoundException(`Producto con id ${id} no encontrado`);
    await this.productoRepository.delete(id);

    await this.logsService.create({
      usuario: 'sistema',
      accion: 'eliminacion-producto',
      descripcion: `Producto ${producto.nombre} eliminado`,
    });
  }
}
