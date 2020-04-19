import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from './config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { UserModule } from './user/user.module';
import { PlaylistItemModule } from './playlist-item/playlist-item.module';
import { PlaylistModule } from './playlist/playlist.module';
import { AuthModule } from './auth/auth.module';
import { ProxyModule } from './proxy/proxy.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useExisting: ConfigService,
    }),
    AuthModule,
    PlaylistModule,
    UserModule,
    PlaylistItemModule,
    ProxyModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
