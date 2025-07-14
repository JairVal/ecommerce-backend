import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Ecommerce Valdivieso version: 2025.07.14.13.38';
  }
}
