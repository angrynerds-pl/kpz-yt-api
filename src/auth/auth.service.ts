import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '.././user/entities/user.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(dto: CreateSessionDto): Promise<User> {
    const user = await this.usersService.findForAuth(dto.username);
    if (user) {
      const valid = await bcryptjs.compare(dto.password, user.password);
      if (valid) {
        delete user.password;
        return user;
      }
    }
    throw new NotFoundException();
  }

  async login(user: User) {
    const payload = { user, sub: user.id };
    return {
      // eslint-disable-next-line @typescript-eslint/camelcase
      access_token: this.jwtService.sign(payload),
    };
  }
}
