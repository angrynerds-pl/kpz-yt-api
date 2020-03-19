import { PlaylistService } from './playlist.service';
import { Module } from '@nestjs/common';
import { PlaylistControler } from './playlist.controler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from './entities/playlist.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Playlist]), TypeOrmModule.forFeature([User])],
  providers: [PlaylistService, UserService],
  controllers: [PlaylistControler],
  exports: [PlaylistService],
})
export class PlaylistModule {}
