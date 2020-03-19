import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';

describe('Auth Controller', () => {
  let controller: AuthController;
  const authServiceMock = {
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service ', async () => {
    const dto = { username: 'test', password: 'test' };
    const user = new User();
    // eslint-disable-next-line @typescript-eslint/camelcase
    const mockedResult = { access_token: 'token' };

    authServiceMock.validateUser = jest.fn(() => Promise.resolve(user));
    authServiceMock.login = jest.fn(() => Promise.resolve(mockedResult));

    const result = await controller.store(dto);

    expect(result).toHaveProperty('access_token', 'token');
    expect(authServiceMock.validateUser).toBeCalledTimes(1);
    expect(authServiceMock.validateUser).toBeCalledWith(dto);
    expect(authServiceMock.validateUser).toBeCalledTimes(1);
    expect(authServiceMock.login).toBeCalledWith(user);
  });
});
