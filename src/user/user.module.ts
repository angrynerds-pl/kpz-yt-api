import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '../config/config.module';
import { PlaylistService } from '../playlist/playlist.service';
import { Playlist } from '../playlist/entities/playlist.entity';
import { PlaylistItem } from '../playlist-item/entities/playlist-item.entity';
import { PlaylistItemService } from '../playlist-item/playlist-item.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Playlist]),
    TypeOrmModule.forFeature([PlaylistItem]),
    ConfigModule,
  ],
  providers: [UserService, PlaylistService, PlaylistItemService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
