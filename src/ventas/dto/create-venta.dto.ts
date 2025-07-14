import { CreateDetalleVentaDto } from './create-detalle-venta.dto';

export class CreateVentaDto {
  id_cliente: number;
  id_usuario: number;
  total: number;
  detalles: CreateDetalleVentaDto[];
}
