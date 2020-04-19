import { Test, TestingModule } from '@nestjs/testing';
import { ProxyService } from './proxy.service';
import { ConfigService } from '../config/config.service';
import { HttpService } from '@nestjs/common';

describe('ProxyService', () => {
  let service: ProxyService;
  const configServiceMock = {
    getApiKey: jest.fn()
  };
  const httpServiceMock = {
    get: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProxyService,
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
        {
          provide: HttpService,
          useValue: httpServiceMock
        },
      ],
    }).compile();

    service = module.get<ProxyService>(ProxyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call callYtApi and return respone', async () => {
    const ytID = '8GYL6c_GTE0';

    const result = service.callYtApi(ytID);
    const i: string = 'sss';
  });
});
