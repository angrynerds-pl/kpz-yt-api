import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { PlaylistService } from '../playlist/playlist.service';
import { ForbiddenException } from '@nestjs/common';
import { Playlist } from '../playlist/entities/playlist.entity';

describe('User Controller', () => {
  let controller: UserController;
  const userServiceMock = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findForAuth: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    canAffect: jest.fn(() => true),
  };

  const playlistServiceMock = {
    findPlaylistsForUser: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: PlaylistService, useValue: playlistServiceMock },
      ],
    }).compile();

    controller = moduleRef.get<UserController>(UserController);
  });

  it('find all users', async () => {
    const expected = [new User(), new User()];
    userServiceMock.findAll = jest.fn(() => Promise.resolve(expected));

    const result = await controller.find(new User());

    expect(result.data).toBe(expected);
  });

  it('find user by id', async () => {
    const userId = 0;
    const expected = new User();
    userServiceMock.findById = jest.fn(() => Promise.resolve(expected));

    const result = await controller.findOne(userId, new User());

    expect(result.data).toBe(expected);
  });

  it('find user by id cannot affect', async () => {
    const userId = 321;
    userServiceMock.canAffect = jest.fn().mockReturnValueOnce(false);

    const authUser = new User();

    await expect(controller.findOne(userId, authUser)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('create user', async () => {
    const expected = new User();
    const dto = {
      username: 'demouser',
      password: 'topsecret',
      firstname: 'John',
      lastname: 'Smith',
    };
    userServiceMock.canAffect = jest.fn().mockReturnValueOnce(true);

    userServiceMock.create = jest.fn(() => Promise.resolve(expected));

    const result = await controller.store(dto);

    expect(result.data).toBe(expected);
  });

  it('update user', async () => {
    const expected = new User();
    const userId = 0;
    const dto = {
      firstname: 'John',
      lastname: 'Smith',
    };
    const authUser = new User();
    authUser.id = userId;

    userServiceMock.canAffect = jest.fn().mockReturnValueOnce(true);
    userServiceMock.update = jest.fn((userId, dto) =>
      Promise.resolve(expected),
    );

    const result = await controller.update(userId, dto, authUser);

    expect(result.data).toBe(expected);
  });

  it('delete user', async () => {
    const expected = new User();
    const userId = 0;

    userServiceMock.delete = jest.fn(() => Promise.resolve(expected));

    userServiceMock.canAffect = jest.fn().mockReturnValueOnce(true);
    const result = await controller.delete(userId, expected);

    expect(result.data).toBe(expected);
  });

  it('find user playlists', async () => {
    const expected = [new Playlist(), new Playlist()];
    const userId = 0;
    const authUser = new User();
    authUser.id = userId;

    playlistServiceMock.findPlaylistsForUser = jest.fn(() =>
      Promise.resolve(expected),
    );

    userServiceMock.canAffect = jest.fn().mockReturnValueOnce(true);
    const result = await controller.findPlaylists(userId, authUser);

    expect(result.data).toBe(expected);
  });
});
