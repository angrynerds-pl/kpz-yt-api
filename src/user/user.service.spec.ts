import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigService } from '../config/config.service';
import { getConnection } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import * as typeorm from 'typeorm';
jest.mock('bcryptjs');

describe('UserService', () => {
  let service: UserService;
  const userRepositoryMock = {
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    count: jest.fn(),
  };
  const configServiceMock = {
    createAuthOptions: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('find all users', async () => {
    const users: User[] = [];
    userRepositoryMock.find = jest.fn(() => Promise.resolve(users));
    const result = await service.findAll();

    expect(Array.isArray(result)).toBe(true);
    expect(userRepositoryMock.find).toBeCalledTimes(1);
  });

  it('find user by id', async () => {
    const id = 1;
    const user = new User();
    userRepositoryMock.findOne = jest.fn(() => user);

    const result = await service.findById(id);

    expect(result).toBe(user);
    expect(userRepositoryMock.findOne).toBeCalledTimes(1);
    expect(userRepositoryMock.findOne).toBeCalledWith(id);
  });

  it('find user for auth', async () => {
    const user = new User();
    let whereFn;
    (typeorm as any).getConnection = jest.fn(() => ({
      createQueryBuilder: jest.fn(() => ({
        addSelect: jest.fn(() => ({
          where: whereFn = jest.fn(() => ({
            getOne: jest.fn(() => Promise.resolve(user)),
          })),
        })),
      })),
    }));

    const result = await service.findForAuth('test');
    expect(whereFn).toBeCalledWith('user.username = :username', {
      username: 'test',
    });
    expect(result).toStrictEqual(user);
  });

  it('create user', async () => {
    const dto = {
      username: 'johnny',
      password: 'topsecret',
      firstname: 'Johnny',
      lastname: 'Smith',
    };
    const user = new User();

    userRepositoryMock.create = jest.fn(() => user);
    userRepositoryMock.count = jest.fn(({}) => Promise.resolve(0));
    userRepositoryMock.save = jest.fn((arg: User) => Promise.resolve(arg));

    (bcryptjs as any).genSalt = jest.requireActual('bcryptjs').genSalt;

    const result = await service.create(dto);

    expect(result).toBeInstanceOf(User);
    expect(result.password).toBe(undefined);
    expect(bcryptjs.hash).toBeCalledWith('topsecret', expect.anything());
    expect(userRepositoryMock.count).toBeCalledTimes(1);
    expect(userRepositoryMock.save).toBeCalledTimes(1);
    expect(userRepositoryMock.save).toBeCalledWith(user);
    expect(userRepositoryMock.create).toBeCalledWith(dto);
    expect(userRepositoryMock.create).toBeCalledTimes(1);
  });

  it('update user', async () => {
    const user = new User();
    user.password = 'password';
    const id = 1;
    const dto = {
      username: 'johnny',
      password: 'topsecretupdate',
      firstname: 'Johnny',
      lastname: 'Smith',
    };
    userRepositoryMock.merge = jest.fn((arg: User) => arg);
    userRepositoryMock.save = jest.fn((arg: User) => Promise.resolve(arg));
    userRepositoryMock.findOne = jest.fn(() => Promise.resolve(user));

    (bcryptjs as any).genSalt = jest.requireActual('bcryptjs').genSalt;

    const result = await service.update(id, dto);

    expect(result).toBeInstanceOf(User);
    expect(result.password).toBe(undefined);
    expect(bcryptjs.hash).toBeCalledWith('topsecretupdate', expect.anything());
    expect(userRepositoryMock.findOne).toBeCalledTimes(1);
    expect(userRepositoryMock.findOne).toBeCalledWith(id);
    expect(userRepositoryMock.merge).toBeCalledTimes(1);
    expect(userRepositoryMock.merge).toBeCalledWith(user, dto);
    expect(userRepositoryMock.save).toBeCalledTimes(1);
    expect(userRepositoryMock.save).toBeCalledWith(user);
  });

  it('delete user', async () => {
    const user = new User();
    const id = 10;
    userRepositoryMock.find = jest.fn(() => Promise.resolve(user));
    userRepositoryMock.delete = jest.fn((param: User) =>
      Promise.resolve(param),
    );

    const result = await service.delete(id);

    expect(result).toStrictEqual(user);
    expect(userRepositoryMock.delete).toBeCalledTimes(1);
  });

  it('find user playlists', async () => {
    /**
     * To be done
     */
  });
});
