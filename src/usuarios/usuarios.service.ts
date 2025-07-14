import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { LogsService } from 'src/logs/logs.service';
import * as bcrypt from 'bcryptjs'; // Asegúrate de tenerlo instalado


@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly logsService: LogsService, 
  ) {}

  findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return usuario;
  }

 async create(data: CreateUsuarioDto): Promise<Usuario> {
  const usuario = this.usuarioRepository.create(data);
  // Hash de contraseña antes de guardar
  usuario.password = await bcrypt.hash(data.password, 10);
  const savedUser = await this.usuarioRepository.save(usuario);

  // Guardar log en MongoDB
  await this.logsService.create({
    usuario: savedUser.nombreUsuario,
    accion: 'creacion',
    descripcion: `Usuario ${savedUser.nombreUsuario} creado`,
  });

  return savedUser;
}

  async remove(id: number): Promise<void> {
    const result = await this.usuarioRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
  }
  async update(id: number, data: UpdateUsuarioDto): Promise<Usuario> {
  const usuario = await this.usuarioRepository.findOneBy({ id });
  if (!usuario) {
    
    throw new NotFoundException(`Usuario con id ${id} no encontrado`);
  }
  // Si se va a cambiar la contraseña, hashearla:
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  Object.assign(usuario, data); // Actualiza solo los campos enviados
  return this.usuarioRepository.save(usuario);
}

}
