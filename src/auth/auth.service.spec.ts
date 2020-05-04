import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

import * as bcryptjs from 'bcryptjs';
import { NotFoundException } from '@nestjs/common';
jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  const jwtServiceMock = {
    sign: jest.fn(),
  };
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

    try {
      await service.validateUser(dto);
    } catch (e) {
      expect(userServiceMock.findForAuth).toBeCalledWith('test');
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });

  it('should return undefined when found but not valid', async () => {
    const dto = { username: 'test', password: 'test' };
    const user = new User();
    user.password = 'passw';

    userServiceMock.findForAuth = jest.fn(() => Promise.resolve(user));
    (bcryptjs.compare as jest.Mock).mockReturnValue(false);

    try {
      await service.validateUser(dto);
    } catch (e) {
      expect(userServiceMock.findForAuth).toBeCalledWith('test');
      expect(bcryptjs.compare).toBeCalledWith('test', 'passw');
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });

  it('should call sign method', async () => {
    const user = new User();
    user.id = 1;
    const result: any = await service.login(user);

    expect(jwtServiceMock.sign).toBeCalledWith({ user, sub: user.id });
    expect(result).toHaveProperty('access_token');
  });
});
