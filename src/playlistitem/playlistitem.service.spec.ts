import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistItemService } from './playlistitem.service';

describe('PlaylistItemService', () => {
  let service: PlaylistItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaylistItemService],
    }).compile();

    service = module.get<PlaylistItemService>(PlaylistItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
