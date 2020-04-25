import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistItemService } from './playlist-item.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlaylistItem } from './entities/playlist-item.entity';
import { Playlist } from '../playlist/entities/playlist.entity';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { User } from '../user/entities/user.entity';
import { PlaylistService } from '../playlist/playlist.service';

describe('PlaylistItemService', () => {
  let service: PlaylistItemService;
  const mockConfigService = {
    createAuthOptions: jest.fn(),
  }
  const mockPlaylistService = {
    findPlaylistsForUser: jest.fn(),
  }
  const mockPlaylistItemRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaylistItemService],
      providers: [
        {
          provide: getRepositoryToken(PlaylistItem),
          useValue: mockPlaylistItemRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: PlaylistService,
          useValue: mockPlaylistService,
        }
      ],
    }).compile();

    service = module.get<PlaylistItemService>(PlaylistItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('canAffect - should call createAuthOptions and return false (bad id)', async () => {
    const user = new User();
    user.id = 1;

    const playlistItem = new PlaylistItem();
    playlistItem.id = 4;
    const playlistItems : PlaylistItem[] = [playlistItem];
    
    const playlist = new Playlist();
    playlist.id = 2;

    const playlists : Playlist[] = [ playlist ];

    mockPlaylistService.findPlaylistsForUser = jest.fn(()=> Promise.resolve(playlists));
    mockPlaylistItemRepository.find = jest.fn(()=> Promise.resolve(playlistItems));
    mockConfigService.createAuthOptions = jest.fn(() => { 
      return { enabled: true } 
    });

    const result = await service.canAffect(user, {id: 1});

    expect(result).toBe(false);
    expect(mockPlaylistService.findPlaylistsForUser).toBeCalledTimes(1);
    expect(mockPlaylistService.findPlaylistsForUser).toBeCalledWith(user.id);
    expect(mockPlaylistItemRepository.find).toBeCalledTimes(playlists.length);
    expect(mockConfigService.createAuthOptions).toBeCalledTimes(1);

  });
  

  it('canAffect - should call createAuthOptions and return true (good id)', async () => {
    const user = new User();
    user.id = 1;

    const playlistItem = new PlaylistItem();
    playlistItem.id = 4;
    const playlistItems : PlaylistItem[] = [ playlistItem ];
    
    const playlist = new Playlist();
    playlist.id = 2;

    const playlists : Playlist[] = [ playlist ];

    mockPlaylistService.findPlaylistsForUser = jest.fn(()=> Promise.resolve(playlists));
    mockPlaylistItemRepository.find = jest.fn(()=> Promise.resolve(playlistItems));
    mockConfigService.createAuthOptions = jest.fn(() => { 
      return { enabled: true } 
    });

    const result = await service.canAffect(user, {id: 4});

    expect(result).toBe(true);
    expect(mockPlaylistService.findPlaylistsForUser).toBeCalledTimes(1);
    expect(mockPlaylistService.findPlaylistsForUser).toBeCalledWith(user.id);
    expect(mockPlaylistItemRepository.find).toBeCalledTimes(playlists.length);
    expect(mockConfigService.createAuthOptions).toBeCalledTimes(1);

  });

  it('canAffect - should call createAuthOptions and return true', async () => {
    const user = new User();
    user.id = 1;
    const playlistItem = new PlaylistItem();
    playlistItem.id = 4;

    mockConfigService.createAuthOptions = jest.fn(() => { 
      return { enabled: false } 
    });

    const result = await service.canAffect(user, playlistItem);

    expect(result).toBe(true);
    expect(mockConfigService.createAuthOptions).toBeCalledTimes(1);

  });
  


  it('should create new playlist item and return if valid', async () => {
    const playlist = new Playlist();
    const dto = {
      title: 'The Banach-Tarski Paradox',
      ytID: 's86-Z-CbaHA',
      playlist: playlist,
    };
    const playlistItem = new PlaylistItem();
    playlistItem.playlist = playlist;
    mockPlaylistItemRepository.create = jest.fn(() => Promise.resolve(playlistItem));
    mockPlaylistItemRepository.save = jest.fn(() => Promise.resolve(playlistItem));

    const result = await service.create(dto);

    expect(result).toBe(playlistItem);
    expect(result).toHaveProperty('playlist');
    expect(mockPlaylistItemRepository.create).toBeCalledTimes(1);
    expect(mockPlaylistItemRepository.create).toBeCalledWith(dto);
  });

  it('should call findAll and return array', async () => {
    const playlistItems: PlaylistItem[] = [];
    mockPlaylistItemRepository.find = jest.fn(() => Promise.resolve(playlistItems));

    const result = await service.findAll();

    expect(Array.isArray(result)).toBe(true);
    expect(mockPlaylistItemRepository.find).toBeCalledTimes(1);
  });

  it('should update and return playlist item', async () => {
    const playlistItem = new PlaylistItem();
    const id = 17;
    const dto = { ytID: 'xsH7654213' };
    mockPlaylistItemRepository.findOne = jest.fn(() => Promise.resolve(playlistItem));
    mockPlaylistItemRepository.merge = jest.fn((param: PlaylistItem) => Promise.resolve(param));
    mockPlaylistItemRepository.save = jest.fn((param: PlaylistItem) => Promise.resolve(param));

    const result = await service.update(id, dto);

    expect(result).toBe(playlistItem);
    expect(mockPlaylistItemRepository.findOne).toBeCalledTimes(1);
    expect(mockPlaylistItemRepository.merge).toBeCalledTimes(1);
    expect(mockPlaylistItemRepository.merge).toBeCalledWith(playlistItem, dto);
    expect(mockPlaylistItemRepository.save).toBeCalledTimes(1);
  });

  it('should call update and throw exception', async () => {
    const id = 23;
    const dto = { ytID: 'xcs876Hvsg1' };
    mockPlaylistItemRepository.findOne = jest
      .fn()
      .mockReturnValueOnce(Promise.resolve(undefined));
    mockPlaylistItemRepository.save = jest.fn();
    mockPlaylistItemRepository.merge = jest.fn();

    await expect(service.update(id, dto)).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(mockPlaylistItemRepository.findOne).toBeCalledTimes(1);
    expect(mockPlaylistItemRepository.save).toBeCalledTimes(0);
    expect(mockPlaylistItemRepository.merge).toBeCalledTimes(0);
  });

  it('should remove playlist item if given exists', async () => {
    const playlistItem = new PlaylistItem();
    const id = 88;
    mockPlaylistItemRepository.findOne = jest.fn(() => Promise.resolve(playlistItem));
    mockPlaylistItemRepository.delete = jest.fn((param: PlaylistItem) => param);

    const result = await service.delete(id);

    expect(result).toBe(playlistItem);
    expect(mockPlaylistItemRepository.findOne).toBeCalledTimes(1);
    expect(mockPlaylistItemRepository.findOne).toBeCalledWith(id);
    expect(mockPlaylistItemRepository.delete).toBeCalledTimes(1);
    expect(mockPlaylistItemRepository.delete).toBeCalledWith(playlistItem);
  });

  it('should call delete and throw exception', async () => {
    const id = 33;
    mockPlaylistItemRepository.findOne = jest.fn((param: number) => Promise.resolve(null));
    mockPlaylistItemRepository.delete = jest.fn();

    await expect(service.delete(id)).rejects.toBeInstanceOf(NotFoundException);

    expect(mockPlaylistItemRepository.findOne).toBeCalledTimes(1);
    expect(mockPlaylistItemRepository.delete).toBeCalledTimes(0);
  });

  it('should call findById and return if found', async () => {
    const playlistItem = new PlaylistItem();
    const id = 12;
    mockPlaylistItemRepository.findOne = jest.fn(() => Promise.resolve(playlistItem));

    const result = await service.findById(id);

    expect(result).toBe(playlistItem);
    expect(mockPlaylistItemRepository.findOne).toBeCalledTimes(1);
    expect(mockPlaylistItemRepository.findOne).toBeCalledWith(id);
  });

  it('should call findById and throw exception', async () => {
    const id = 0;
    mockPlaylistItemRepository.findOne = jest.fn(() => undefined);
    let result;
    try {
      result = await service.findById(id);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }

    expect(result).toBe(undefined);
    expect(mockPlaylistItemRepository.findOne).toBeCalledTimes(1);
    expect(mockPlaylistItemRepository.findOne).toBeCalledWith(id);
  });
});
