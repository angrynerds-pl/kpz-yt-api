import { Module } from '@nestjs/common';
import { PlaylistItemController } from './playlistitem.controller';
import { PlaylistItemService } from './playlistitem.service';

@Module({
  controllers: [PlaylistItemController],
  providers: [PlaylistItemService],
  exports: [PlaylistItemService]
})
export class PlaylistItemModule {}
