import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistItemController } from './playlistitem.controller';

describe('PlaylistItem Controller', () => {
  let controller: PlaylistItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaylistItemController],
    }).compile();

    controller = module.get<PlaylistItemController>(PlaylistItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
