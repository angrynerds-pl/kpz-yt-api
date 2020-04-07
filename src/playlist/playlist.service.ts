import {
  Injectable,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './entities/playlist.entity';
import { User } from '../user/entities/user.entity'
import { Repository } from 'typeorm';
import { CanAffect } from '../auth/contracts/can-affect.contact';
import { CreatePlaylistDto } from './dto/create-playlist-dto';
import { UpdatePlaylistDto } from './dto/update-playlist-dto';
import { UserService } from '../user/user.service';
import { ConfigService } from '../config/config.service';

@Injectable()
export class PlaylistService implements CanAffect<Playlist>{
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>, // PlaylistItemService
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async canAffect(user: User, entity: Playlist | { id: number }): Promise<boolean> {  
    
    if(!this.configService.createAuthOptions().enabled)
    {
      return true;
    }

    let foundPlaylists = await this.findPlaylistsForUser(
      user.id,
    );

    for (const element of foundPlaylists){
      if(parseInt(element.id as any) === parseInt(entity.id as any)){
        return true;
      }
    };
    
    return false;
  }

  async findAll(): Promise<Playlist[]> {
    return this.playlistRepository.find();
  }

  async findById(id: number): Promise<Playlist> {
    const playlist = await this.playlistRepository.findOne(id);
    if (!playlist) {
      throw new NotFoundException();
    }
    return playlist;
  }

  /*   async findPlaylistItems(id: number): Promise<PlaylistItem[]> {
    return Promise.resolve([]);
  } */

  async create(dto: CreatePlaylistDto): Promise<Playlist> {
    if (await this.userService.findById(dto.user.id)) {
      return this.playlistRepository.save(this.playlistRepository.create(dto));
    }
  }

  async delete(id: number): Promise<Playlist> {
    const playlist = await this.findById(id);
    this.playlistRepository.delete(playlist);
    return playlist;
  }

  async update(id: number, dto: UpdatePlaylistDto): Promise<Playlist> {
    if (
      (dto.user !== undefined &&
        (await this.userService.findById(dto.user.id))) ||
      dto.user === undefined
    ) {
      const playlist = await this.findById(id);
      return this.playlistRepository.save(
        this.playlistRepository.merge(playlist, dto),
      );
    }
  }

  async findPlaylistsForUser(userId: number): Promise<Playlist[]> {
    const playlists = await this.playlistRepository.find({
      where: {
        user: { id: userId },
      },
    });
    return playlists;
  }
}
