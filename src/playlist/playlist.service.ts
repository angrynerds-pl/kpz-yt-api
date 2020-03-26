import {
  Injectable,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './entities/playlist.entity';
import { Repository } from 'typeorm';
// import { PlaylistItem } from '../playlist-item/entities/playlist-item.entity';
import { CreatePlaylistDto } from './dto/create-playlist-dto';
import { UpdatePlaylistDto } from './dto/update-playlist-dto';
import { UserService } from '../user/user.service';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>, // PlaylistItemService
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

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
