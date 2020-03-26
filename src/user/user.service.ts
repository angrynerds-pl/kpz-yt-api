import {
  Injectable,
  ConflictException,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository, FindManyOptions, getConnection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcryptjs from 'bcryptjs';
import { CanAffect } from '../auth/contracts/can-affect.contact';
import { ConfigService } from '../config/config.service';

@Injectable()
export class UserService implements CanAffect<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  canAffect(user: User, entity: User | { id: number }): boolean {
    console.log(user, entity);

    return (
      parseInt(user.id as any) === parseInt(entity.id as any) ||
      !this.configService.createAuthOptions().enabled
    );
  }

  async findAll(options?: FindManyOptions<User>): Promise<User[]> {
    return await this.userRepository.find(options);
  }

  async findById(id: number): Promise<User> {
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

  async update(userId: number, dto: UpdateUserDto): Promise<User> {
    if (dto.password) {
      dto.password = await this.hashPassword(dto);
    }
    const userToUpdate = await this.findById(userId);
    const updatedUser = this.userRepository.merge(userToUpdate, dto);
    await this.userRepository.save(updatedUser);
    delete updatedUser.password;
    return updatedUser;
  }

  async delete(userId: number): Promise<User> {
    const userToDelete = await this.findById(userId);
    this.userRepository.delete(userToDelete);
    return userToDelete;
  }

  private async hashPassword(
    dto: CreateUserDto | UpdateUserDto,
  ): Promise<string> {
    const salt = await bcryptjs.genSalt();
    return bcryptjs.hash(dto.password, salt);
  }
}
