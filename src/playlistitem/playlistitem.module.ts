import { Module } from '@nestjs/common';
import { PlaylistItemController } from './playlistitem.controller';
import { PlaylistItemService } from './playlistitem.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistItem } from './entities/playlistitem.entity';

@Module({
  controllers: [PlaylistItemController],
  providers: [PlaylistItemService],
  exports: [PlaylistItemService],
  imports: [TypeOrmModule.forFeature([PlaylistItem])]
})
export class PlaylistItemModule {}
