import { PlaylistService } from './playlist.service';
import { Module, forwardRef } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from './entities/playlist.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { ConfigModule } from '../config/config.module';
import { PlaylistItem } from '../playlist-item/entities/playlist-item.entity';
import { PlaylistItemService } from '../playlist-item/playlist-item.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Playlist]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([PlaylistItem]),
    ConfigModule,
  ],
  providers: [PlaylistService, UserService, PlaylistItemService],
  controllers: [PlaylistController],
  exports: [PlaylistService],
})
export class PlaylistModule {}
