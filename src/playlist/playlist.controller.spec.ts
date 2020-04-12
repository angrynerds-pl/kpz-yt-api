import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { Playlist } from './entities/playlist.entity';
import { PlaylistItem } from '../playlist-item/entities/playlist-item.entity';
import { PlaylistItemService } from '../playlist-item/playlist-item.service';
import { User } from '../user/entities/user.entity';
import { ForbiddenException } from '@nestjs/common';

describe('Playlist Controler', () => {
  let controller: PlaylistController;
  const playlistServiceMock = {
    canAffect: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findPlaylistItems: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  };
  const playlistItemServiceMock = {
    findForPlaylist: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaylistController],
      providers: [
        {
          provide: PlaylistService,
          useValue: playlistServiceMock,
        },
        {
          provide: PlaylistItemService,
          useValue: playlistItemServiceMock,
        },
      ],
    }).compile();

    controller = module.get<PlaylistController>(PlaylistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll', async () => {
    const authUser = new User();
    const playlists: Playlist[] = [];
    playlistServiceMock.findAll = jest.fn(() => Promise.resolve(playlists));
    playlistServiceMock.canAffect = jest.fn(() => Promise.resolve(true));

    const result = await controller.findAll(authUser);

    expect(playlistServiceMock.canAffect).toBeCalledTimes(1);
    expect(Array.isArray(result.data)).toBe(true);
    expect(playlistServiceMock.findAll).toBeCalledTimes(1);
  });

  it('should throw ForbiddenException before call findAll', async () => {
    const authUser = new User();
    const playlists: Playlist[] = [];
    playlistServiceMock.findAll = jest.fn(() => Promise.resolve(playlists));
    playlistServiceMock.canAffect = jest.fn(() => Promise.resolve(false));

    let result;
    try{
      result = await controller.findAll(authUser);
    } catch (e){
      expect(e).toBeInstanceOf(ForbiddenException);
    }
    
    expect(result).toBeUndefined();
    expect(playlistServiceMock.canAffect).toBeCalledTimes(1);
    expect(playlistServiceMock.findAll).toBeCalledTimes(0);
  });

  it('should call findById', async () => {
    const authUser = new User();
    const playlist = new Playlist();
    const id = 1;
    playlistServiceMock.findById = jest.fn(() => Promise.resolve(playlist));
    playlistServiceMock.canAffect = jest.fn(() => Promise.resolve(true));

    const result = await controller.findById(id, authUser);

    expect(result.data).toBe(playlist);
    expect(playlistServiceMock.canAffect).toBeCalledTimes(1);
    expect(playlistServiceMock.findById).toBeCalledTimes(1);
    expect(playlistServiceMock.findById).toBeCalledWith(id);
  });

  it('should throw ForbiddenException before call findById', async () => {
    const authUser = new User();
    const playlist = new Playlist();
    const id = 1;
    playlistServiceMock.findById = jest.fn(() => Promise.resolve(playlist));
    playlistServiceMock.canAffect = jest.fn(() => Promise.resolve(false));

    let result;
    try{
      result = await controller.findById(id, authUser);
    } catch (e){
      expect(e).toBeInstanceOf(ForbiddenException);
    }
    
    expect(result).toBeUndefined();
    expect(playlistServiceMock.canAffect).toBeCalledTimes(1);
    expect(playlistServiceMock.findById).toBeCalledTimes(0);
  });

  it('should call create', async () => {
    const authUser = new User();
    const playlistItem = new PlaylistItem();
    const playlist = new Playlist();
    playlist.id = 2;
    const id = 1;
    const dto = {
      ytID: 'asdFSc2qsx',
      playlist: playlist,
    };
    
    playlistItemServiceMock.create = jest.fn(() =>
      Promise.resolve(playlistItem),
    );
    playlistServiceMock.canAffect = jest.fn(() => Promise.resolve(true));

    const result = await controller.storePlaylistItem(id, dto, authUser);

    expect(result.data).toBe(playlistItem);
    expect(playlistServiceMock.canAffect).toBeCalledTimes(1);
    expect(playlistItemServiceMock.create).toBeCalledTimes(1);
    expect(playlistItemServiceMock.create).toBeCalledWith(dto);
    expect(dto.playlist.id).toBe(id);
  });

  it('should throw ForbiddenException before call create', async () => {
    const authUser = new User();
    const playlistItem = new PlaylistItem();
    const playlist = new Playlist();
    playlist.id = 2;
    const id = 1;
    const dto = {
      ytID: 'asdFSc2qsx',
      playlist: playlist,
    };

    playlistItemServiceMock.create = jest.fn(() =>
      Promise.resolve(playlistItem),
    );
    playlistServiceMock.canAffect = jest.fn(() => Promise.resolve(false));

    let result;
    try{
      result =await controller.storePlaylistItem(id, dto, authUser);
    } catch (e){
      expect(e).toBeInstanceOf(ForbiddenException);
    }
    
    expect(result).toBeUndefined();
    expect(playlistServiceMock.canAffect).toBeCalledTimes(1);
    expect(playlistItemServiceMock.create).toBeCalledTimes(0);
  });

  it('should call findPlaylistItems', async () => {
    const authUser = new User();
    const playlistItems: PlaylistItem[] = [];
    const id = 1;
    playlistItemServiceMock.findForPlaylist = jest.fn(() =>
      Promise.resolve(playlistItems),
    );
    playlistServiceMock.canAffect = jest.fn(() => Promise.resolve(true));

    const result = await controller.findPlaylistItems(id, authUser);

    expect(Array.isArray(result.data)).toBe(true);
    expect(playlistServiceMock.canAffect).toBeCalledTimes(1);
    expect(playlistItemServiceMock.findForPlaylist).toBeCalledTimes(1);
    expect(playlistItemServiceMock.findForPlaylist).toBeCalledWith(id);
  });

  it('should throw ForbiddenException before call findPlaylistItems', async () => {
    const authUser = new User();
    const playlistItems: PlaylistItem[] = [];
    const id = 1;
    playlistItemServiceMock.findForPlaylist = jest.fn(() =>
      Promise.resolve(playlistItems),
    );
    playlistServiceMock.canAffect = jest.fn(() => Promise.resolve(false));

    let result;
    try{
      result = await controller.findPlaylistItems(id, authUser);
    } catch (e){
      expect(e).toBeInstanceOf(ForbiddenException);
    }

    expect(result).toBeUndefined();
    expect(playlistServiceMock.canAffect).toBeCalledTimes(1);
    expect(playlistItemServiceMock.findForPlaylist).toBeCalledTimes(0);
  });

  it('should call create', async () => {
    const playlist = new Playlist();
    const user = new User();
    user.id = 1;
    const dto = { name: 'test', user: user };
    playlistServiceMock.create = jest.fn(() => Promise.resolve(playlist));

    const result = await controller.store(dto, user);

    expect(result.data).toBe(playlist);

    expect(playlistServiceMock.create).toBeCalledTimes(1);
    expect(playlistServiceMock.create).toBeCalledWith(dto);
  });

  it('should throw ForbiddenException before call create', async () => {
    const playlist = new Playlist();
    const user = new User();
    user.id = 1;
    const dto = { name: 'test', user: user };
    const authUser = new User();
    authUser.id = 2;
    playlistServiceMock.create = jest.fn(() => Promise.resolve(playlist));

    let result;
    try{
      result = await controller.store(dto, authUser);
    } catch (e){
      expect(e).toBeInstanceOf(ForbiddenException);
    }

    expect(result).toBe(undefined);
    expect(playlistServiceMock.create).toBeCalledTimes(0);
  });


  it('should call update', async () => {
    const authUser = new User();
    const playlist = new Playlist();
    const user = new User();
    user.id = 1;
    const dto = { name: 'test', user: user };
    const id = 1;
    playlistServiceMock.update = jest.fn(() => Promise.resolve(playlist));
    playlistServiceMock.canAffect = jest.fn(() => Promise.resolve(true));

    const result = await controller.update(id, dto, authUser);

    expect(result.data).toBe(playlist);
    expect(playlistServiceMock.canAffect).toBeCalledTimes(1);
    expect(playlistServiceMock.update).toBeCalledTimes(1);
    expect(playlistServiceMock.update).toBeCalledWith(id, dto);
  });

  it('should throw ForbiddenException before call update', async () => {
    const authUser = new User();
    const playlist = new Playlist();
    const user = new User();
    user.id = 1;
    const dto = { name: 'test', user: user };
    const id = 1;
    playlistServiceMock.update = jest.fn(() => Promise.resolve(playlist));
    playlistServiceMock.canAffect = jest.fn(() => Promise.resolve(false));

    let result;
    try{
      result = await controller.update(id, dto, authUser);
    } catch (e){
      expect(e).toBeInstanceOf(ForbiddenException);
    }

    expect(result).toBeUndefined();
    expect(playlistServiceMock.canAffect).toBeCalledTimes(1);
    expect(playlistServiceMock.update).toBeCalledTimes(0);
  });

  it('should call delete', async () => {
    const authUser = new User();
    const playlist = new Playlist();
    const id = 1;
    playlistServiceMock.delete = jest.fn(() => Promise.resolve(playlist));
    playlistServiceMock.canAffect = jest.fn(() => Promise.resolve(true));

    const result = await controller.delete(id, authUser);

    expect(result.data).toBe(playlist);
    expect(playlistServiceMock.canAffect).toBeCalledTimes(1);
    expect(playlistServiceMock.delete).toBeCalledTimes(1);
    expect(playlistServiceMock.delete).toBeCalledWith(id);
  });

  it('should throw ForbiddenException before call delete', async () => {
    const authUser = new User();
    const playlist = new Playlist();
    const id = 1;
    playlistServiceMock.delete = jest.fn(() => Promise.resolve(playlist));
    playlistServiceMock.canAffect = jest.fn(() => Promise.resolve(false));

    let result;
    try{
      result = await controller.delete(id, authUser);
    } catch (e){
      expect(e).toBeInstanceOf(ForbiddenException);
    }

    expect(result).toBeUndefined();
    expect(playlistServiceMock.canAffect).toBeCalledTimes(1);
    expect(playlistServiceMock.delete).toBeCalledTimes(0);
  });
});
