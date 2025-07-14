import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LogDocument = Log & Document;

@Schema()
export class Log {
  @Prop({ required: true })
  usuario: string;

  @Prop({ required: true })
  accion: string;

  @Prop()
  descripcion: string;

  @Prop({ default: Date.now })
  fecha: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);
