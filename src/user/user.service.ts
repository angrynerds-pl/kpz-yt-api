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
import { PlaylistService } from '../playlist/playlist.service';
import { PlaylistItemService } from '../playlist-item/playlist-item.service';
import { ProxyService } from '../proxy/proxy.service';
import { first } from 'rxjs/operators';

@Injectable()
export class UserService implements CanAffect<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly playlistService: PlaylistService,
    private readonly playlistItemService: PlaylistItemService,
    private readonly proxyService: ProxyService,
  ) {}

  async canAffect(user: User, entity: User | { id: number }): Promise<boolean> {
    return Promise.resolve(
      parseInt(user.id as any) === parseInt(entity.id as any) ||
        !this.configService.createAuthOptions().enabled,
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

  async findTopTitles(userId: number, limit: number) {
    const foundPlaylists = await this.playlistService.findPlaylistsForUser(
      userId,
    );
    // Get all user's playlist items
    const foundItems = [];

    for (const playlist of foundPlaylists) {
      const currentPlaylistItems = await this.playlistItemService.findForPlaylist(
        playlist.id,
      );
      foundItems.push(...currentPlaylistItems);
    }

    // Get only top {limit} items
    foundItems.sort((a, b) => a.playbackCount - b.playbackCount);
    const topItems = foundItems.slice(foundItems.length - limit);

    // Map titles of top songs to playbackCount
    const ytIdToTopTitlesMap = new Map<string, any>();
    for (const item of topItems) {
      const observable = this.proxyService.callYtApi(item.ytID);
      const ytApiResp = (await observable
        .toPromise()
        .then(result => result)) as any;
      if (!('items' in ytApiResp)) {
        throw new NotFoundException();
      }
      const title = ytApiResp.items[0].snippet.title;
      let currentPlayCountForYtID;
      if (ytIdToTopTitlesMap.has(item.ytID)) {
        currentPlayCountForYtID = ytIdToTopTitlesMap.get(item.ytID)
          .playbackCount;
      } else {
        currentPlayCountForYtID = 0;
      }
      ytIdToTopTitlesMap.set(item.ytID, {
        title: title,
        playbackCount: currentPlayCountForYtID + item.playbackCount,
      });
    }

    const topTitles = Array.from(ytIdToTopTitlesMap.values());

    return topTitles;
  }

  private async hashPassword(
    dto: CreateUserDto | UpdateUserDto,
  ): Promise<string> {
    const salt = await bcryptjs.genSalt();
    return bcryptjs.hash(dto.password, salt);
  }
}
