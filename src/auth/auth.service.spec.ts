import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

import * as bcryptjs from 'bcryptjs';
jest.mock('bcryptjs');
(bcryptjs.compare as jest.Mock).mockReturnValue(true);

describe('AuthService', () => {
  let service: AuthService;
  const jwtServiceMock = {};
  const userServiceMock = {
    findForAuth: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate and return user without password when found and valid', async () => {
    const dto = { username: 'test', password: 'test' };
    const user = new User();
    user.password = 'passw';

    userServiceMock.findForAuth = jest.fn(() => Promise.resolve(user));
    (bcryptjs.compare as jest.Mock).mockReturnValue(true);

    const result: User = await service.validateUser(dto);

    expect(userServiceMock.findForAuth).toBeCalledWith('test');
    expect(bcryptjs.compare).toBeCalledWith('test', 'passw');
    expect(result).toBeInstanceOf(User);
    expect(result).not.toHaveProperty('password');
  });

  it('should return undefined when not found', async () => {
    const dto = { username: 'test', password: 'test' };

    userServiceMock.findForAuth = jest.fn(() => Promise.resolve(undefined));
    (bcryptjs.compare as jest.Mock).mockReturnValue(true);

    const result: User | undefined = await service.validateUser(dto);

    expect(userServiceMock.findForAuth).toBeCalledWith('test');
    expect(result).toBeUndefined();
  });

  it('should return undefined when found but not valid', async () => {
    const dto = { username: 'test', password: 'test' };
    const user = new User();
    user.password = 'passw';

    userServiceMock.findForAuth = jest.fn(() => Promise.resolve(user));
    (bcryptjs.compare as jest.Mock).mockReturnValue(false);

    const result: User = await service.validateUser(dto);

    expect(userServiceMock.findForAuth).toBeCalledWith('test');
    expect(bcryptjs.compare).toBeCalledWith('test', 'passw');
    expect(result).toBeUndefined();
  });
});
