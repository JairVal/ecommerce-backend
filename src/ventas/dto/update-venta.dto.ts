import { CreateDetalleVentaDto } from './create-detalle-venta.dto';

export class UpdateVentaDto {
  id_cliente?: number;
  id_usuario?: number;
  total?: number;
  detalles?: CreateDetalleVentaDto[]; // Puedes actualizar los detalles también
}
