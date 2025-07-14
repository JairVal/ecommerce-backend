export class CreateProductoDto {
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  id_categoria: number;
  id_proveedor: number;
  imagen?: string;
}
