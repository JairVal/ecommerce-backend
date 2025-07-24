import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose'; // Importa 'Types' para manejar 'ObjectId'
import { Cliente, ClienteDocument } from './schemas/cliente.schema';
import { LogsService } from 'src/logs/logs.service';

@Injectable()
export class ClientesService {
  constructor(
    @InjectModel(Cliente.name) private clienteModel: Model<ClienteDocument>,
    private readonly logsService: LogsService,
  ) {}

  async findAll(): Promise<Cliente[]> {
    return this.clienteModel.find().exec();
  }

  async findOne(id: string): Promise<Cliente> {
    // Verifica si el id es válido
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Cliente con id ${id} no encontrado`);
    }

    const cliente = await this.clienteModel.findById(id).exec();
    if (!cliente) {
      throw new NotFoundException(`Cliente con id ${id} no encontrado`);
    }
    return cliente;
  }

  async create(data: Partial<Cliente>): Promise<Cliente> {
    const nuevoCliente = new this.clienteModel(data);
    const savedClient = await nuevoCliente.save();

    await this.logsService.create({
      usuario: savedClient.nombre,
      accion: 'creacion-cliente',
      descripcion: `Cliente ${savedClient.nombre} creado`,
    });

    return savedClient;
  }

  async update(id: string, data: Partial<Cliente>): Promise<Cliente> {
    // Verifica si el id es válido
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Cliente con id ${id} no encontrado`);
    }

    const cliente = await this.clienteModel.findById(id);
    if (!cliente) {
      throw new NotFoundException(`Cliente con id ${id} no encontrado`);
    }

    Object.assign(cliente, data);
    const updatedClient = await cliente.save();

    await this.logsService.create({
      usuario: updatedClient.nombre,
      accion: 'actualizacion-cliente',
      descripcion: `Cliente ${updatedClient.nombre} actualizado`,
    });

    return updatedClient;
  }

  async remove(id: string): Promise<void> {
    // Verifica si el id es válido
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Cliente con id ${id} no encontrado`);
    }

    const cliente = await this.clienteModel.findById(id);
    if (!cliente) {
      throw new NotFoundException(`Cliente con id ${id} no encontrado`);
    }

    await this.clienteModel.findByIdAndDelete(id);

    await this.logsService.create({
      usuario: cliente.nombre,
      accion: 'eliminacion-cliente',
      descripcion: `Cliente ${cliente.nombre} eliminado`,
    });
  }
}
