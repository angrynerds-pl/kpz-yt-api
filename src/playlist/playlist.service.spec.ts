import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistService } from './playlist.service';

describe('Playlist Service', () => {
  let controller: PlaylistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaylistService],
    }).compile();

    controller = module.get<PlaylistService>(PlaylistService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
