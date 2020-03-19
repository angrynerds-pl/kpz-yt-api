import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>, //private readonly playlistRepository: Repository<Playlist>,
      ) {}
    
      async findById(id: number): Promise<User> {
        const user = await this.userRepository.findOne(id);
        if (!user) {
          throw new NotFoundException();
        }
        return user;
      }
}
