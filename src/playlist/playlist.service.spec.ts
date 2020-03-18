import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistService } from './playlist.service';
import { Playlist } from './entities/playlist.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('Playlist Service', () => {
  let service: PlaylistService;
  const mockPlaylistRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaylistService],
      providers: [
        {
          provide: getRepositoryToken(Playlist),
          useValue: mockPlaylistRepository
        }
      ]

    }).compile();

    service = module.get<PlaylistService>(PlaylistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call find', async () => {
    const playlists: Playlist[] = [];
    mockPlaylistRepository.find = jest.fn(() => Promise.resolve(playlists));
    
    const result = await service.findAll();

    expect(Array.isArray(result)).toBe(true);

    expect(mockPlaylistRepository.find).toBeCalledTimes(1);
  });

  it('should call findOne and return if found', async () => {
    const playlist = new Playlist();
    const id = 0;
    mockPlaylistRepository.findOne = jest.fn(() => Promise.resolve(playlist));
    
    const result = await service.findById(id);

    expect(result).toBe(playlist);

    expect(mockPlaylistRepository.findOne).toBeCalledTimes(1);
    expect(mockPlaylistRepository.findOne).toBeCalledWith(id);
  });

  it('should call findOne and throw when not found', async () => {
    const playlist = new Playlist();
    const id = 0;
    mockPlaylistRepository.findOne = jest.fn(() => undefined);

    let result;
    try{
      result = await service.findById(id);
    } catch (e)
    {
      expect(e).toBeInstanceOf(NotFoundException);
    }
    expect(result).toBe(undefined);

    expect(mockPlaylistRepository.findOne).toBeCalledTimes(1);
    expect(mockPlaylistRepository.findOne).toBeCalledWith(id);
    
  });

  it('should return empty array', async () => {
    const playlists: Playlist[] = [];
    const id = 0;
    const result = await service.findPlaylistItems(id);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    
  });

  it('should call save and create', async () => {
    const playlist = new Playlist();
    const argPlaylist = new Playlist();
    argPlaylist.id = 2;
    const dto = { name:'test' }

    mockPlaylistRepository.save = jest.fn(() => playlist);
    mockPlaylistRepository.create = jest.fn(() => argPlaylist);

    const result = await service.create(dto);

    expect(result).toBe(playlist);

    expect(mockPlaylistRepository.save).toBeCalledTimes(1);
    expect(mockPlaylistRepository.save).toBeCalledWith(argPlaylist);
    expect(mockPlaylistRepository.save).not.toBeCalledWith(playlist);
    expect(mockPlaylistRepository.create).toBeCalledTimes(1);
    expect(mockPlaylistRepository.create).toBeCalledWith(dto);
    
  });

  it('should call findById then delete when found', async () => {
    const playlist = new Playlist();
    const id = 0;

    mockPlaylistRepository.findOne = jest.fn(() => playlist);
    mockPlaylistRepository.delete = jest.fn((arg: Playlist) => arg);

    const result = await service.delete(id);

    expect(result).toBe(playlist);

    expect(mockPlaylistRepository.findOne).toBeCalledTimes(1);
    expect(mockPlaylistRepository.findOne).toBeCalledWith(id);
    expect(mockPlaylistRepository.delete).toBeCalledTimes(1);
    expect(mockPlaylistRepository.delete).toBeCalledWith(playlist);
    
  });

  it('should call findById then merge and save when found', async () => {
    const playlist = new Playlist();
    const dto = {name: 'test'};
    const id = 0;

    mockPlaylistRepository.findOne = jest.fn(() => playlist);
    mockPlaylistRepository.merge = jest.fn((arg: Playlist) => arg);
    mockPlaylistRepository.save = jest.fn((arg: Playlist) => arg);

    const result = await service.update(id, dto);

    expect(result).toBe(playlist);

    expect(mockPlaylistRepository.findOne).toBeCalledTimes(1);
    expect(mockPlaylistRepository.findOne).toBeCalledWith(id);
    expect(mockPlaylistRepository.merge).toBeCalledTimes(1);
    expect(mockPlaylistRepository.merge).toBeCalledWith(playlist, dto);
    expect(mockPlaylistRepository.save).toBeCalledTimes(1);
    expect(mockPlaylistRepository.save).toBeCalledWith(playlist);
    
  });



  
});
