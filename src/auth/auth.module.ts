import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useExisting: ConfigService,
    }),
    UserModule,
    ConfigModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
