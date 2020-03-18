import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistControler } from './playlist.controler';

describe('Playlist Controler', () => {
  let controller: PlaylistControler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaylistControler],
    }).compile();

    controller = module.get<PlaylistControler>(PlaylistControler);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
