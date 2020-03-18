import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Playlist } from '../playlist/entities/playlist.entity';
import { User } from './entities/user.entity';
import { Repository, FindManyOptions, getConnection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, //private readonly playlistRepository: Repository<Playlist>,
  ) {}

  async findAll(options?: FindManyOptions<User>): Promise<User[]> {
    return await this.userRepository.find(options);
  }

  async findById(id: number): Promise<User | undefined> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async findForAuth(username: string): Promise<User | undefined> {
    const user = await getConnection()
      .createQueryBuilder(User, 'user')
      .addSelect('user.password')
      .where('user.username = :username', { username })
      .getOne();
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const count = await this.userRepository.count({
      username: dto.username,
    });
    if (count === 0) {
      dto.password = await this.hashPassword(dto);
      const user = this.userRepository.create(dto);
      const savedUser = await this.userRepository.save(user);
      delete savedUser.password;
      return savedUser;
    } else {
      throw new ConflictException({
        exists: ['username'],
      });
    }
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (user) {
      if (dto.password) {
        dto.password = await this.hashPassword(dto);
      }
      const updatedUser = this.userRepository.merge(user, dto);
      await this.userRepository.save(updatedUser);
      delete updatedUser.password;
      return updatedUser;
    } else {
      throw new NotFoundException();
    }
  }

  async delete(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (user) {
      this.userRepository.delete(user);
      return user;
    } else {
      throw new NotFoundException();
    }
  }

  async findPlaylists(authUser: User): Promise<Playlist[]> {
    return Promise.resolve(
      [],
    ); /* this.playlistRepository.find({
      where: {
        user: authUser,
      },
    }); */
  }

  private async hashPassword(
    dto: CreateUserDto | UpdateUserDto,
  ): Promise<string> {
    const salt = await bcryptjs.genSalt();
    return bcryptjs.hash(dto.password, salt);
  }
}
