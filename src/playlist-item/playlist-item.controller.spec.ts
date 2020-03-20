import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistItemController } from './playlist-item.controller';
import { PlaylistItemService } from './playlist-item.service';
import { PlaylistItem } from './entities/playlist-item.entity';
import { Playlist } from '../playlist/entities/playlist.entity';

describe('PlaylistItem Controller', () => {
  let controller: PlaylistItemController;
  const playlistItemServiceMock = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findForPlaylist: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaylistItemController],
      providers: [
        {
          provide: PlaylistItemService,
          useValue: playlistItemServiceMock,
        },
      ],
    }).compile();

    controller = module.get<PlaylistItemController>(PlaylistItemController);
  });

  it('update playlist item', async () => {
    const expected = new PlaylistItem();
    playlistItemServiceMock.update = jest.fn(() => Promise.resolve(expected));
    const dto = {};
    const playlistItemId = 1;

    const result = await controller.update(playlistItemId, dto);

    expect(result.data).toBe(expected);
  });

  it('delete playlist item', async () => {
    const expected = new PlaylistItem();
    playlistItemServiceMock.delete = jest.fn(() => Promise.resolve(expected));
    const playlistItemId = 1;

    const result = await controller.delete(playlistItemId);

    expect(result.data).toBe(expected);
  });

  it('find all playlist items', async () => {
    const expected = [new PlaylistItem(), new PlaylistItem()];

    playlistItemServiceMock.findAll = jest.fn(() => Promise.resolve(expected));

    const result = await controller.find();

    expect(result.data).toBe(expected);
  });

  it('find playlist item by id', async () => {
    const expected = new PlaylistItem();
    const playlistItemId = 1;

    playlistItemServiceMock.findById = jest.fn(() => Promise.resolve(expected));

    const result = await controller.findOne(playlistItemId);

    expect(result.data).toBe(expected);
  });
});
