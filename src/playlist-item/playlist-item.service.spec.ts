import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistItemService } from './playlist-item.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlaylistItem } from './entities/playlist-item.entity';
import { Playlist } from '../playlist/entities/playlist.entity';
import { NotFoundException } from '@nestjs/common';

describe('PlaylistItemService', () => {
  let service: PlaylistItemService;
  const mockedRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
    delete: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaylistItemService],
      providers: [
        {
          provide: getRepositoryToken(PlaylistItem),
          useValue: mockedRepo
        }
      ]
    }).compile();

    service = module.get<PlaylistItemService>(PlaylistItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new playlist item and return if valid', async () => {
    const playlist = new Playlist();
    const dto = {title: 'The Banach-Tarski Paradox', ytID: 's86-Z-CbaHA', playlist: playlist};
    const playlistItem = new PlaylistItem();
    playlistItem.playlist = playlist;
    mockedRepo.create = jest.fn(() => Promise.resolve(playlistItem));
    mockedRepo.save = jest.fn(() => Promise.resolve(playlistItem))
    
    const result = await service.create(dto);

    expect(result).toBe(playlistItem);
    expect(result).toHaveProperty('playlist');
    expect(mockedRepo.create).toBeCalledTimes(1);
    expect(mockedRepo.create).toBeCalledWith(dto);
  })

  it('should call findAll and return array', async () => {
    const playlistItems: PlaylistItem[] = [];
    mockedRepo.find = jest.fn(() => Promise.resolve(playlistItems));

    const result = await service.findAll();

    expect(Array.isArray(result)).toBe(true);
    expect(mockedRepo.find).toBeCalledTimes(1);
  })

  it('should call findById and return if found', async () => {
      const playlistItem = new PlaylistItem();
      const id = 12;
      mockedRepo.findOne = jest.fn(() => Promise.resolve(playlistItem));

      const result = await service.findById(id);

      expect(result).toBe(playlistItem);
      expect(mockedRepo.findOne).toBeCalledTimes(1);
      expect(mockedRepo.findOne).toBeCalledWith(id);
  })

  it('should call findById and throw exception', async () => {
    const playlistItem = new PlaylistItem();
    const id = 0;
    mockedRepo.findOne = jest.fn(() => undefined);
    let result;
    try {
      result = await service.findById(id);
    }
    catch(e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }

    expect(result).toBe(undefined);
    expect(mockedRepo.findOne).toBeCalledTimes(1);
    expect(mockedRepo.findOne).toBeCalledWith(id);
  })

  it('should remove playlist item if given exists', async () => {
    const playlistItem = new PlaylistItem();
    const id = 88;
    mockedRepo.findOne = jest.fn(() => Promise.resolve(playlistItem));
    mockedRepo.delete = jest.fn((param: PlaylistItem) =>  param);

    const result = await service.delete(id);

    expect(result).toBe(playlistItem);
    expect(mockedRepo.findOne).toBeCalledTimes(1);
    expect(mockedRepo.findOne).toBeCalledWith(id);
    expect(mockedRepo.delete).toBeCalledTimes(1);
    expect(mockedRepo.delete).toBeCalledWith(playlistItem);
  })
});
