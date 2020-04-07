import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistService } from './playlist.service';
import { Playlist } from './entities/playlist.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { ConfigService } from '../config/config.service';

describe('Playlist Service', () => {
  let service: PlaylistService;
  const mockUserService = {
    findById: jest.fn(),
  };
  const mockConfigService = {
    createAuthOptions: jest.fn(),
  };
  const mockPlaylistRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaylistService],
      providers: [
        {
          provide: getRepositoryToken(Playlist),
          useValue: mockPlaylistRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        }
      ],
    }).compile();

    service = module.get<PlaylistService>(PlaylistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('canAffect - should call findPlaylistForUser and createAuthOptions and return false', async () => {
    const user = new User();
    user.id = 1;
    const playlists: Playlist[] = [];

    mockPlaylistRepository.find = jest.fn(() => Promise.resolve(playlists));
    mockConfigService.createAuthOptions = jest.fn(() => { 
      return { enabled: true } 
    });

    const result = await service.canAffect(user, {id: 0});

    expect(result).toBe(false);
    expect(mockPlaylistRepository.find).toBeCalledTimes(1);
    
    expect(mockConfigService.createAuthOptions).toBeCalledTimes(1);

  });

  it('canAffect - should call findPlaylistForUser and createAuthOptions and return true', async () => {
    const user = new User();
    user.id = 1;
    const playlist = new Playlist();
    playlist.id = 1;
    const playlists: Playlist[] = [playlist];

    mockPlaylistRepository.find = jest.fn(() => Promise.resolve(playlists));
    mockConfigService.createAuthOptions = jest.fn(() => { 
      return { enabled: true } 
    });

    const result = await service.canAffect(user, {id: 1});

    expect(result).toBe(true);
    expect(mockPlaylistRepository.find).toBeCalledTimes(1);
    
    expect(mockConfigService.createAuthOptions).toBeCalledTimes(1);
    
  });

  it('canAffect - should call only createAuthOptions and return true', async () => {
    const user = new User();
    user.id = 1;
    const playlists: Playlist[] = [];

    mockPlaylistRepository.find = jest.fn(() => Promise.resolve(playlists));
    mockConfigService.createAuthOptions = jest.fn(() => { 
      return { enabled: false } 
    });

    const result = await service.canAffect(user, {id: 0});

    expect(result).toBe(true);
    expect(mockPlaylistRepository.find).toBeCalledTimes(0);
    expect(mockConfigService.createAuthOptions).toBeCalledTimes(1);
    
  });

  it('findAll - should call find', async () => {
    const playlists: Playlist[] = [];
    mockPlaylistRepository.find = jest.fn(() => Promise.resolve(playlists));

    const result = await service.findAll();

    expect(Array.isArray(result)).toBe(true);

    expect(mockPlaylistRepository.find).toBeCalledTimes(1);
  });

  it('findById - should call findOne and return if found', async () => {
    const playlist = new Playlist();
    const id = 1;
    mockPlaylistRepository.findOne = jest.fn(() => Promise.resolve(playlist));

    const result = await service.findById(id);

    expect(result).toBe(playlist);

    expect(mockPlaylistRepository.findOne).toBeCalledTimes(1);
    expect(mockPlaylistRepository.findOne).toBeCalledWith(id);
  });

  it('findById - should call findOne and throw when not found', async () => {
    const playlist = new Playlist();
    const id = 1;
    mockPlaylistRepository.findOne = jest.fn(() => undefined);

    let result;
    try {
      result = await service.findById(id);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
    expect(result).toBe(undefined);

    expect(mockPlaylistRepository.findOne).toBeCalledTimes(1);
    expect(mockPlaylistRepository.findOne).toBeCalledWith(id);
  });

  it('create - should check if user exists then call save and create', async () => {
    const playlist = new Playlist();
    const argPlaylist = new Playlist();
    const user = new User();
    user.id = 1;
    argPlaylist.id = 2;
    const dto = { name: 'test', user: user };

    mockPlaylistRepository.save = jest.fn(() => playlist);
    mockPlaylistRepository.create = jest.fn(() => argPlaylist);
    mockUserService.findById = jest.fn(() => user);

    const result = await service.create(dto);

    expect(result).toBe(playlist);

    expect(mockPlaylistRepository.save).toBeCalledTimes(1);
    expect(mockPlaylistRepository.save).toBeCalledWith(argPlaylist);
    expect(mockPlaylistRepository.save).not.toBeCalledWith(playlist);
    expect(mockPlaylistRepository.create).toBeCalledTimes(1);
    expect(mockPlaylistRepository.create).toBeCalledWith(dto);
    expect(mockUserService.findById).toBeCalledTimes(1);
    expect(mockUserService.findById).toBeCalledWith(user.id);
  });

  it('create - should check if user exists, if not exception should be thrown', async () => {
    const playlist = new Playlist();
    const argPlaylist = new Playlist();
    const user = new User();
    user.id = 1;
    argPlaylist.id = 2;
    const dto = { name: 'test', user: user };

    mockPlaylistRepository.save = jest.fn(() => Promise.resolve(playlist));
    mockPlaylistRepository.create = jest.fn(() => argPlaylist);
    mockUserService.findById = jest.fn(() => {
      throw new NotFoundException();
    });

    let result;
    try {
      result = await service.create(dto);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }

    expect(result).toBe(undefined);

    expect(mockPlaylistRepository.save).toBeCalledTimes(0);
    expect(mockPlaylistRepository.create).toBeCalledTimes(0);
    expect(mockUserService.findById).toBeCalledTimes(1);
    expect(mockUserService.findById).toBeCalledWith(user.id);
  });

  it('update - should check if user exists, then call findOne, merge and save', async () => {
    const playlist = new Playlist();
    const user = new User();
    user.id = 1;
    const dto = { name: 'test', user: user };
    const id = 1;

    mockPlaylistRepository.findOne = jest.fn(() => Promise.resolve(playlist));
    mockPlaylistRepository.merge = jest.fn((arg: Playlist) => arg);
    mockPlaylistRepository.save = jest.fn((arg: Playlist) =>
      Promise.resolve(arg),
    );
    mockUserService.findById = jest.fn(() => Promise.resolve(user));

    const result = await service.update(id, dto);

    expect(result).toBe(playlist);

    expect(mockPlaylistRepository.findOne).toBeCalledTimes(1);
    expect(mockPlaylistRepository.findOne).toBeCalledWith(id);
    expect(mockPlaylistRepository.merge).toBeCalledTimes(1);
    expect(mockPlaylistRepository.merge).toBeCalledWith(playlist, dto);
    expect(mockPlaylistRepository.save).toBeCalledTimes(1);
    expect(mockPlaylistRepository.save).toBeCalledWith(playlist);
    expect(mockUserService.findById).toBeCalledTimes(1);
    expect(mockUserService.findById).toBeCalledWith(user.id);
  });

  it('update - should check if user exists, if not exception should be thrown', async () => {
    const playlist = new Playlist();
    const user = new User();
    user.id = 1;
    const dto = { name: 'test', user: user };
    const id = 1;

    mockPlaylistRepository.findOne = jest.fn(() => playlist);
    mockPlaylistRepository.merge = jest.fn((arg: Playlist) => arg);
    mockPlaylistRepository.save = jest.fn((arg: Playlist) => arg);
    mockUserService.findById = jest.fn(() => {
      throw new NotFoundException();
    });

    let result;
    try {
      result = await service.update(id, dto);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }

    expect(result).toBe(undefined);

    expect(mockPlaylistRepository.findOne).toBeCalledTimes(0);
    expect(mockPlaylistRepository.merge).toBeCalledTimes(0);
    expect(mockPlaylistRepository.save).toBeCalledTimes(0);
    expect(mockUserService.findById).toBeCalledTimes(1);
    expect(mockUserService.findById).toBeCalledWith(user.id);
  });

  it('update - should omit user existence check and call findById, merge and save', async () => {
    const playlist = new Playlist();
    const dto = { name: 'test', user: undefined };
    const id = 1;

    mockPlaylistRepository.findOne = jest.fn(() => playlist);
    mockPlaylistRepository.merge = jest.fn((arg: Playlist) => arg);
    mockPlaylistRepository.save = jest.fn((arg: Playlist) => arg);
    mockUserService.findById = jest.fn(() => {
      throw new NotFoundException();
    });

    const result = await service.update(id, dto);

    expect(result).toBe(playlist);

    expect(mockPlaylistRepository.findOne).toBeCalledTimes(1);
    expect(mockPlaylistRepository.findOne).toBeCalledWith(id);
    expect(mockPlaylistRepository.merge).toBeCalledTimes(1);
    expect(mockPlaylistRepository.merge).toBeCalledWith(playlist, dto);
    expect(mockPlaylistRepository.save).toBeCalledTimes(1);
    expect(mockPlaylistRepository.save).toBeCalledWith(playlist);
    expect(mockUserService.findById).toBeCalledTimes(0);
  });

  it('delete - should call findById then delete when found', async () => {
    const playlist = new Playlist();
    const id = 1;

    mockPlaylistRepository.findOne = jest.fn(() => playlist);
    mockPlaylistRepository.delete = jest.fn((arg: Playlist) => arg);

    const result = await service.delete(id);

    expect(result).toBe(playlist);

    expect(mockPlaylistRepository.findOne).toBeCalledTimes(1);
    expect(mockPlaylistRepository.findOne).toBeCalledWith(id);
    expect(mockPlaylistRepository.delete).toBeCalledTimes(1);
    expect(mockPlaylistRepository.delete).toBeCalledWith(playlist);
  });
});
