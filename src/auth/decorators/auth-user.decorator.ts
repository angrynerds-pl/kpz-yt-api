import { createParamDecorator } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { User } from '../../user/entities/user.entity';

export const AuthUser = createParamDecorator(
  (data, req): User => {
    if (process.env['AUTH_ENABLED'] == 'false') return new User();
    return (getRepository(User).create(req.user.payload.user) as any) as User;
  },
);
