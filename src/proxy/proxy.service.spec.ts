import { Test, TestingModule } from '@nestjs/testing';
import { ProxyService } from './proxy.service';
import { ConfigService } from '../config/config.service';
import { HttpService } from '@nestjs/common';
import { Observable } from 'rxjs';

describe('ProxyService', () => {
  let service: ProxyService;
  const configServiceMock = {
    getApiKey: jest.fn()
  };
  const httpServiceMock = {
    get: jest.fn()
  };
  const observableMock = {
    pipe: jest.fn()
  }

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
        {
          provide: Observable,
          useValue: observableMock
        }
      ],
    }).compile();

    service = module.get<ProxyService>(ProxyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call callYtApi and return respone', async () => {
    const ytID = '_WHRWLnVm_M';
    configServiceMock.getApiKey = jest.fn(() => 'testPurposeApiKey');
    httpServiceMock.get = jest.fn(() => new Observable());
    observableMock.pipe = jest.fn(() => { //only part of response
    {
        items: [
          {
           "kind": "youtube#video",
           "etag": "nxOHAKTVB7baOKsQgTtJIyGxcs8/i-e0tjNA-biXNNrG9cMVZpzbc64",
           "id": "_WHRWLnVm_M",
           "snippet": {
            "publishedAt": "2019-10-01T12:58:46.000Z",
            "channelId": "UC6nSFpj9HTCZ5t-N3Rm3-HA",
            "title": "Laws & Causes",
          },       
        }]
    }
    });
    const result = service.callYtApi(ytID);
    
    expect(result).toBeInstanceOf(Observable);
  });

});
