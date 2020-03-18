import { PlaylistService } from './playlist.service';
import { Module } from '@nestjs/common';
import { PlaylistControler } from './playlist.controler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from './entities/playlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Playlist])],
  providers: [PlaylistService],
  controllers: [PlaylistControler],
})
export class PlaylistModule {}
