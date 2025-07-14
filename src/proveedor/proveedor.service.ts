import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from './proveedor.entity';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class ProveedorService {
  constructor(
    @InjectRepository(Proveedor)
    private readonly proveedorRepository: Repository<Proveedor>,
    private readonly logsService: LogsService,
  ) {}

  findAll(): Promise<Proveedor[]> {
    return this.proveedorRepository.find();
  }

  async findOne(id: number): Promise<Proveedor> {
    const proveedor = await this.proveedorRepository.findOneBy({ id });
    if (!proveedor) throw new NotFoundException(`Proveedor con id ${id} no encontrado`);
    return proveedor;
  }

  async create(data: CreateProveedorDto): Promise<Proveedor> {
    const proveedor = this.proveedorRepository.create(data);
    const savedProveedor = await this.proveedorRepository.save(proveedor);

    await this.logsService.create({
      usuario: 'sistema',
      accion: 'creacion-proveedor',
      descripcion: `Proveedor ${savedProveedor.nombre} creado`,
    });

    return savedProveedor;
  }

  async update(id: number, data: UpdateProveedorDto): Promise<Proveedor> {
    const proveedor = await this.proveedorRepository.findOneBy({ id });
    if (!proveedor) throw new NotFoundException(`Proveedor con id ${id} no encontrado`);
    Object.assign(proveedor, data);
    const updatedProveedor = await this.proveedorRepository.save(proveedor);

    await this.logsService.create({
      usuario: 'sistema',
      accion: 'actualizacion-proveedor',
      descripcion: `Proveedor ${updatedProveedor.nombre} actualizado`,
    });

    return updatedProveedor;
  }

  async remove(id: number): Promise<void> {
    const proveedor = await this.proveedorRepository.findOneBy({ id });
    if (!proveedor) throw new NotFoundException(`Proveedor con id ${id} no encontrado`);
    await this.proveedorRepository.delete(id);

    await this.logsService.create({
      usuario: 'sistema',
      accion: 'eliminacion-proveedor',
      descripcion: `Proveedor ${proveedor.nombre} eliminado`,
    });
  }
}
