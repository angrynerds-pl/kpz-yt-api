import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { Playlist } from './entities/playlist.entity';
import { PlaylistItem } from '../playlist-item/entities/playlist-item.entity';
import { PlaylistItemService } from '../playlist-item/playlist-item.service';
import { User } from '../user/entities/user.entity';

describe('Playlist Controler', () => {
  let controller: PlaylistController;
  const playlistServiceMock = {
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
    const playlists: Playlist[] = [];
    playlistServiceMock.findAll = jest.fn(() => Promise.resolve(playlists));

    const result = await controller.findAll();

    expect(Array.isArray(result.data)).toBe(true);
    expect(playlistServiceMock.findAll).toBeCalledTimes(1);
  });

  it('should call findById', async () => {
    const playlist = new Playlist();
    const id = 1;
    playlistServiceMock.findById = jest.fn(() => Promise.resolve(playlist));

    const result = await controller.findById(id);

    expect(result.data).toBe(playlist);

    expect(playlistServiceMock.findById).toBeCalledTimes(1);
    expect(playlistServiceMock.findById).toBeCalledWith(id);
  });

  it('should call create', async () => {
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

    const result = await controller.storePlaylistItem(id, dto);

    expect(result.data).toBe(playlistItem);

    expect(playlistItemServiceMock.create).toBeCalledTimes(1);
    expect(playlistItemServiceMock.create).toBeCalledWith(dto);
    expect(dto.playlist.id).toBe(id);
  });

  it('should call findPlaylistItems', async () => {
    const playlistItems: PlaylistItem[] = [];
    const id = 1;
    playlistItemServiceMock.findForPlaylist = jest.fn(() =>
      Promise.resolve(playlistItems),
    );

    const result = await controller.findPlaylistItems(id);

    expect(Array.isArray(result.data)).toBe(true);

    expect(playlistItemServiceMock.findForPlaylist).toBeCalledTimes(1);
    expect(playlistItemServiceMock.findForPlaylist).toBeCalledWith(id);
  });

  it('should call create', async () => {
    const playlist = new Playlist();
    const user = new User();
    user.id = 1;
    const dto = { name: 'test', user: user };
    playlistServiceMock.create = jest.fn(() => Promise.resolve(playlist));

    const result = await controller.store(dto);

    expect(result.data).toBe(playlist);

    expect(playlistServiceMock.create).toBeCalledTimes(1);
    expect(playlistServiceMock.create).toBeCalledWith(dto);
  });

  it('should call update', async () => {
    const playlist = new Playlist();
    const user = new User();
    user.id = 1;
    const dto = { name: 'test', user: user };
    const id = 1;
    playlistServiceMock.update = jest.fn(() => Promise.resolve(playlist));

    const result = await controller.update(id, dto);

    expect(result.data).toBe(playlist);

    expect(playlistServiceMock.update).toBeCalledTimes(1);
    expect(playlistServiceMock.update).toBeCalledWith(id, dto);
  });

  it('should call delete', async () => {
    const playlist = new Playlist();
    const id = 1;
    playlistServiceMock.delete = jest.fn(() => Promise.resolve(playlist));

    const result = await controller.delete(id);

    expect(result.data).toBe(playlist);

    expect(playlistServiceMock.delete).toBeCalledTimes(1);
    expect(playlistServiceMock.delete).toBeCalledWith(id);
  });
});
