import { Test, TestingModule } from '@nestjs/testing';
import { ClientesService } from './clientes.service';
import { getModelToken } from '@nestjs/mongoose';
import { LogsService } from 'src/logs/logs.service';
import { Cliente } from './schemas/cliente.schema';

describe('ClientesService', () => {
  let service: ClientesService;

  beforeEach(async () => {
    const mockClienteModel = {
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    };

    const mockLogsService = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientesService,
        {
          provide: getModelToken(Cliente.name),
          useValue: mockClienteModel,
        },
        {
          provide: LogsService,
          useValue: mockLogsService,
        },
      ],
    }).compile();

    service = module.get<ClientesService>(ClientesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
