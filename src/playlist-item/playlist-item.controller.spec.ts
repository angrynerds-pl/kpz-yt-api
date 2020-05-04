import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistItemController } from './playlist-item.controller';
import { PlaylistItemService } from './playlist-item.service';
import { PlaylistItem } from './entities/playlist-item.entity';
import { User } from '../user/entities/user.entity';
import { ForbiddenException } from '@nestjs/common/exceptions/forbidden.exception';
import { PlaylistService } from '../playlist/playlist.service';
import { Playlist } from '../playlist/entities/playlist.entity';

describe('PlaylistItem Controller', () => {
  let controller: PlaylistItemController;
  const playlistServiceMock = {
    canAffect: jest.fn(),
  }
  const playlistItemServiceMock = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findForPlaylist: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    canAffect: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaylistItemController],
      providers: [
        {
          provide: PlaylistItemService,
          useValue: playlistItemServiceMock,
        },
        {
          provide: PlaylistService,
          useValue: playlistServiceMock,
        }
      ],
    }).compile();

    controller = module.get<PlaylistItemController>(PlaylistItemController);
  });

  it('update playlist item (without checking playlist.canAffect)', async () => {
    const authUser = new User();
    const expected = new PlaylistItem();
    playlistItemServiceMock.update = jest.fn(() => Promise.resolve(expected));
    const dto = {};
    const playlistItemId = 1;

    playlistItemServiceMock.canAffect = jest.fn(() => Promise.resolve(true));
    playlistServiceMock.canAffect = jest.fn(() => Promise.resolve(true));

    const result = await controller.update(playlistItemId, dto, authUser);

    expect(playlistItemServiceMock.canAffect).toBeCalledTimes(1);
    expect(playlistServiceMock.canAffect).toBeCalledTimes(0);
    expect(result.data).toBe(expected);
  });

  it('update playlist item (with checking playlist.canAffect)', async () => {
    const authUser = new User();
    const expected = new PlaylistItem();
    playlistItemServiceMock.update = jest.fn(() => Promise.resolve(expected));
    const dto = { playlist: new Playlist() };
    const playlistItemId = 1;

    playlistItemServiceMock.canAffect = jest.fn(() => Promise.resolve(true));
    playlistServiceMock.canAffect = jest.fn(() => Promise.resolve(true));

    const result = await controller.update(playlistItemId, dto, authUser);

    expect(playlistItemServiceMock.canAffect).toBeCalledTimes(1);
    expect(playlistServiceMock.canAffect).toBeCalledTimes(1);
    expect(result.data).toBe(expected);
  });

  it('throw ForbiddenException before update playlist item (access denied to PlaylistItem)', async () => {
    const authUser = new User();
    const expected = new PlaylistItem();
    playlistItemServiceMock.update = jest.fn(() => Promise.resolve(expected));
    const dto = {};
    const playlistItemId = 1;

    playlistItemServiceMock.canAffect = jest.fn(() => Promise.resolve(false));
    playlistServiceMock.canAffect = jest.fn(() => Promise.resolve(true));

    let result;
    try{
      result = await controller.update(playlistItemId, dto, authUser);
    } catch (e){
      expect(e).toBeInstanceOf(ForbiddenException);
    }

    expect(result).toBeUndefined();
    expect(playlistItemServiceMock.canAffect).toBeCalledTimes(1);
    expect(playlistServiceMock.canAffect).toBeCalledTimes(0);

  });

  it('throw ForbiddenException before update playlist item (access denied to Playlist)', async () => {
    const authUser = new User();
    const expected = new PlaylistItem();
    playlistItemServiceMock.update = jest.fn(() => Promise.resolve(expected));
    const dto = {playlist: new Playlist()};
    const playlistItemId = 1;

    playlistItemServiceMock.canAffect = jest.fn(() => Promise.resolve(true));
    playlistServiceMock.canAffect = jest.fn(() => Promise.resolve(false));

    let result;
    try{
      result = await controller.update(playlistItemId, dto, authUser);
    } catch (e){
      expect(e).toBeInstanceOf(ForbiddenException);
    }

    expect(result).toBeUndefined();
    expect(playlistItemServiceMock.canAffect).toBeCalledTimes(1);
    expect(playlistServiceMock.canAffect).toBeCalledTimes(1);

  });

  it('delete playlist item', async () => {
    const authUser = new User();
    const expected = new PlaylistItem();
    playlistItemServiceMock.delete = jest.fn(() => Promise.resolve(expected));
    const playlistItemId = 1;

    playlistItemServiceMock.canAffect = jest.fn(() => Promise.resolve(true));

    const result = await controller.delete(playlistItemId, authUser);

    expect(playlistItemServiceMock.canAffect).toBeCalledTimes(1);
    expect(result.data).toBe(expected);
  });

  it('throw ForbiddenException before delete playlist item', async () => {
    const authUser = new User();
    const expected = new PlaylistItem();
    playlistItemServiceMock.delete = jest.fn(() => Promise.resolve(expected));
    const playlistItemId = 1;

    playlistItemServiceMock.canAffect = jest.fn(() => Promise.resolve(false));

    let result;
    try{
      result = await controller.delete(playlistItemId, authUser);
    } catch (e){
      expect(e).toBeInstanceOf(ForbiddenException);
    }

    expect(result).toBeUndefined();
    expect(playlistItemServiceMock.canAffect).toBeCalledTimes(1);

  });

  it('find all playlist items', async () => {
    const authUser = new User();
    const expected = [new PlaylistItem(), new PlaylistItem()];

    playlistItemServiceMock.findAll = jest.fn(() => Promise.resolve(expected));
    playlistItemServiceMock.canAffect = jest.fn(() => Promise.resolve(true));

    const result = await controller.find(authUser);

    expect(playlistItemServiceMock.canAffect).toBeCalledTimes(1);
    expect(result.data).toBe(expected);
  });

  it('throw ForbiddenException before find all playlist items', async () => {
    const authUser = new User();
    const expected = [new PlaylistItem(), new PlaylistItem()];

    playlistItemServiceMock.findAll = jest.fn(() => Promise.resolve(expected));
    playlistItemServiceMock.canAffect = jest.fn(() => Promise.resolve(false));


    let result;
    try{
      result = await controller.find(authUser);
    } catch (e){
      expect(e).toBeInstanceOf(ForbiddenException);
    }

    expect(result).toBeUndefined();
    expect(playlistItemServiceMock.canAffect).toBeCalledTimes(1);
  });

  it('find playlist item by id', async () => {
    const authUser = new User();
    const expected = new PlaylistItem();
    const playlistItemId = 1;

    playlistItemServiceMock.findById = jest.fn(() => Promise.resolve(expected));
    playlistItemServiceMock.canAffect = jest.fn(() => Promise.resolve(true));

    const result = await controller.findOne(playlistItemId, authUser);

    expect(playlistItemServiceMock.canAffect).toBeCalledTimes(1);
    expect(result.data).toBe(expected);
  });

  it('throw ForbiddenException before find playlist item by id', async () => {
    const authUser = new User();
    const expected = new PlaylistItem();
    const playlistItemId = 1;

    playlistItemServiceMock.findById = jest.fn(() => Promise.resolve(expected));
    playlistItemServiceMock.canAffect = jest.fn(() => Promise.resolve(false));

    let result;
    try{
      result = await controller.findOne(playlistItemId, authUser);
    } catch (e){
      expect(e).toBeInstanceOf(ForbiddenException);
    }

    expect(result).toBeUndefined();
    expect(playlistItemServiceMock.canAffect).toBeCalledTimes(1);

  });
});
