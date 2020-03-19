import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistControler } from './playlist.controler';
import { PlaylistService } from './playlist.service';
import { Playlist } from './entities/playlist.entity';
import { PlaylistItem } from 'src/playlist-item/entities/playlist-item.entity';
import { User } from '../user/entities/user.entity';


describe('Playlist Controler', () => {
  let controller: PlaylistControler;
  const playlistServiceMock = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findPlaylistItems: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaylistControler],
      providers: [
        {
          provide: PlaylistService,
          useValue: playlistServiceMock,
        }
      ]
    }).compile();

    controller = module.get<PlaylistControler>(PlaylistControler);
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
    const id = 0;
    playlistServiceMock.findById = jest.fn(() => Promise.resolve(playlist));

    const result = await controller.findById(0);

    expect(result.data).toBe(playlist);

    expect(playlistServiceMock.findById).toBeCalledTimes(1);
    expect(playlistServiceMock.findById).toBeCalledWith(id);
  });

  it('should call findPlaylistItems', async () => {
    const playlistItems: PlaylistItem[] = [];
    const id = 0;
    playlistServiceMock.findPlaylistItems = jest.fn(() => Promise.resolve(playlistItems));

    const result = await controller.findPlaylistItems(0);

    expect(Array.isArray(result.data)).toBe(true);

    expect(playlistServiceMock.findPlaylistItems).toBeCalledTimes(1);
    expect(playlistServiceMock.findPlaylistItems).toBeCalledWith(id);
  });

  it('should call create', async () => {
    const playlist = new Playlist();
    const user = new User();
    user.id = 0;
    const dto = {name: 'test', user: user};
    playlistServiceMock.create = jest.fn(() => Promise.resolve(playlist));

    const result = await controller.store(dto);

    expect(result.data).toBe(playlist);

    expect(playlistServiceMock.create).toBeCalledTimes(1);
    expect(playlistServiceMock.create).toBeCalledWith(dto);
  });

  it('should call update', async () => {
    const playlist = new Playlist();
    const user = new User();
    user.id = 0;
    const dto = {name: 'test', user: user};
    const id = 0;
    playlistServiceMock.update = jest.fn(() => Promise.resolve(playlist));

    const result = await controller.update(id, dto);

    expect(result.data).toBe(playlist);

    expect(playlistServiceMock.update).toBeCalledTimes(1);
    expect(playlistServiceMock.update).toBeCalledWith(id, dto);
  });

  it('should call delete', async () => {
    const playlist = new Playlist();
    const id = 0;
    playlistServiceMock.delete = jest.fn(() => Promise.resolve(playlist));

    const result = await controller.delete(id);

    expect(result.data).toBe(playlist);

    expect(playlistServiceMock.delete).toBeCalledTimes(1);
    expect(playlistServiceMock.delete).toBeCalledWith(id);
  });
});
