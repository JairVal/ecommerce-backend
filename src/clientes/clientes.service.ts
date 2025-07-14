import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { LogsService } from 'src/logs/logs.service';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    private readonly logsService: LogsService, 
  ) {}

  findAll(): Promise<Cliente[]> {
    return this.clienteRepository.find();
  }

  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOneBy({ id });
    if (!cliente) {
      throw new NotFoundException(`Cliente con id ${id} no encontrado`);
    }
    return cliente;
  }

  async create(data: CreateClienteDto): Promise<Cliente> {
  const cliente = this.clienteRepository.create(data);
  const savedClient = await this.clienteRepository.save(cliente);

    // Log automático
    await this.logsService.create({
      usuario: savedClient.nombre,
      accion: 'creacion-cliente',
      descripcion: `Cliente ${savedClient.nombre} creado`,
    });

    return savedClient;
  }

  async update(id: number, data: UpdateClienteDto): Promise<Cliente> {
  const cliente = await this.clienteRepository.findOneBy({ id });
  if (!cliente) {
    throw new NotFoundException(`Cliente con id ${id} no encontrado`);
  }
  Object.assign(cliente, data);
  const updatedClient = await this.clienteRepository.save(cliente);

  // Log automático
    await this.logsService.create({
      usuario: updatedClient.nombre,
      accion: 'actualizacion-cliente',
      descripcion: `Cliente ${updatedClient.nombre} actualizado`,
    });

    return updatedClient;
  }
async remove(id: number): Promise<void> {
  const cliente = await this.clienteRepository.findOneBy({ id });
  if (!cliente) {
    throw new NotFoundException(`Cliente con id ${id} no encontrado`);
  }
  await this.clienteRepository.delete(id);

    // Log automático
    await this.logsService.create({
      usuario: cliente.nombre,
      accion: 'eliminacion-cliente',
      descripcion: `Cliente ${cliente.nombre} eliminado`,
    });
  }
}
