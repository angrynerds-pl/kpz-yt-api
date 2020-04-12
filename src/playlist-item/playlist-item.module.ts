import { Module } from '@nestjs/common';
import { PlaylistItemController } from './playlist-item.controller';
import { PlaylistItemService } from './playlist-item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistItem } from './entities/playlist-item.entity';
import { ConfigModule } from '../config/config.module';
import { Playlist } from '../playlist/entities/playlist.entity';
import { User } from '../user/entities/user.entity';
import { PlaylistModule } from 'src/playlist/playlist.module';

@Module({
  controllers: [PlaylistItemController],
  providers: [PlaylistItemService],
  exports: [PlaylistItemService],
  imports: [TypeOrmModule.forFeature([PlaylistItem]), 
            ConfigModule,
            PlaylistModule]
})
export class PlaylistItemModule {}
