import { PlaylistService } from './playlist.service';
import { Module, forwardRef } from '@nestjs/common';
import { PlaylistControler } from './playlist.controler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from './entities/playlist.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Playlist]),
    TypeOrmModule.forFeature([User]),
    ConfigModule,
  ],
  providers: [PlaylistService, UserService],
  controllers: [PlaylistControler],
  exports: [PlaylistService],
})
export class PlaylistModule {}
