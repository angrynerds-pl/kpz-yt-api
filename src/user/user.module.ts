import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '../config/config.module';
import { PlaylistModule } from '../playlist/playlist.module';
import { PlaylistService } from '../playlist/playlist.service';
import { Playlist } from '../playlist/entities/playlist.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Playlist]),
    ConfigModule,
  ],
  providers: [UserService, PlaylistService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
