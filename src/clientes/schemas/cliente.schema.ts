import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClienteDocument = Cliente & Document;

@Schema({ collection: 'clientes' }) // opcional: asegura que la colección se llame igual
export class Cliente {
  @Prop({ required: true, maxlength: 50 })
  nombre: string;

  @Prop({ required: true, maxlength: 50 })
  apellido: string;

  @Prop({ type: String })
  direccion?: string;

  @Prop({ maxlength: 20 })
  telefono?: string;

  @Prop({ unique: true, maxlength: 100 })
  email?: string;
}

export const ClienteSchema = SchemaFactory.createForClass(Cliente);
