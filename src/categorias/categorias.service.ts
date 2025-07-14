import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { LogsService } from 'src/logs/logs.service';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    private readonly logsService: LogsService, 
  ) {}

  findAll(): Promise<Categoria[]> {
    return this.categoriaRepository.find();
  }

  async findOne(id: number): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOneBy({ id });
    if (!categoria) throw new NotFoundException(`Categoría con id ${id} no encontrada`);
    return categoria;
  }

  async create(data: CreateCategoriaDto): Promise<Categoria> {
    const categoria = this.categoriaRepository.create(data);
    const savedCategoria = await this.categoriaRepository.save(categoria);

    // Log automático
    await this.logsService.create({
      usuario: 'sistema', // puedes ajustar el usuario si luego tienes autenticación
      accion: 'creacion-categoria',
      descripcion: `Categoría ${savedCategoria.nombre} creada`,
    });

    return savedCategoria;
  }

  async update(id: number, data: UpdateCategoriaDto): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOneBy({ id });
    if (!categoria) throw new NotFoundException(`Categoría con id ${id} no encontrada`);
    Object.assign(categoria, data);
    const updatedCategoria = await this.categoriaRepository.save(categoria);

    // Log automático
    await this.logsService.create({
      usuario: 'sistema',
      accion: 'actualizacion-categoria',
      descripcion: `Categoría ${updatedCategoria.nombre} actualizada`,
    });

    return updatedCategoria;
  }

   async remove(id: number): Promise<void> {
    const categoria = await this.categoriaRepository.findOneBy({ id });
    if (!categoria) throw new NotFoundException(`Categoría con id ${id} no encontrada`);
    await this.categoriaRepository.delete(id);

    // Log automático
    await this.logsService.create({
      usuario: 'sistema',
      accion: 'eliminacion-categoria',
      descripcion: `Categoría ${categoria.nombre} eliminada`,
    });
  }
}
