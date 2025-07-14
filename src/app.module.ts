import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ClientesModule } from './clientes/clientes.module';
import { CategoriasModule } from './categorias/categorias.module';
import { ProductosModule } from './productos/productos.module';
import { ProveedorModule } from './proveedor/proveedor.module';
import { VentasModule } from './ventas/ventas.module';
import { DetalleVentaModule } from './detalle-venta/detalle-venta.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { LogsModule } from './logs/logs.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),  // Cargar variables de entorno

    // Conexión a MongoDB (Mongoose)
    MongooseModule.forRoot(process.env.MONGO_URI || ''),

    // Conexión a PostgreSQL (TypeORM)
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT as unknown as number,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      ssl: { rejectUnauthorized: false },
    }),

    UsuariosModule,
    ClientesModule,
    LogsModule,
    CategoriasModule,
    ProveedorModule,
    ProductosModule,
    VentasModule,
    AuthModule,
    // Agrega aquí los demás módulos
  ],
})
export class AppModule {}
