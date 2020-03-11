import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class ConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: process.env['DB_HOST'] || 'localhost',
      port:  (process.env['DB_PORT'] as any as number) || 3306,
      username: process.env['DB_USERNAME'] || 'root',
      password: process.env['DB_PASSWORD'] || 'root',
      database: process.env['DB_SCHEMA'] || 'main',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging:'all'
    };
  }
}
