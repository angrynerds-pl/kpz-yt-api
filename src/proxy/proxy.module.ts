import { Module, HttpModule } from '@nestjs/common';
import { ProxyController } from './proxy.controller';
import { ProxyService } from './proxy.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({
    timeout: 5000,
  }),
],
  controllers: [ProxyController],
  providers: [ProxyService],
  exports: [ProxyService],
})
export class ProxyModule {}
