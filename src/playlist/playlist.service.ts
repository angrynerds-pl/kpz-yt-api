import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './entities/playlist.entity';
import { Repository, FindManyOptions } from 'typeorm';
import { PlaylistItem } from 'src/playlist-item/entities/playlist-item.entity';
import { CreatePlaylistDto } from './dto/createPlaylistDto';
import { UpdatePlaylistDto } from './dto/updatePlaylistDto';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>, // PlaylistItemService
  ) {}

  async findAll(): Promise<Playlist[]> {
    return await this.playlistRepository.find();
  }

  async findById(id: number): Promise<Playlist> {
    const playlist = await this.playlistRepository.findOne(id);
    if (!playlist) {
      throw new NotFoundException({
        /*  */
      });
    }
    return;
  }

  async findPlaylistItems(id: number): Promise<PlaylistItem[]> {
    return Promise.resolve([]);
  }

  async create(dto: CreatePlaylistDto): Promise<Playlist> {
    return await this.playlistRepository.save(
      this.playlistRepository.create(dto),
    );
  }

  async delete(id: number): Promise<Playlist> {
    const playlist = await this.findById(id);
    this.playlistRepository.delete(playlist);
    return playlist;
  }

  async update(id: number, dto: UpdatePlaylistDto): Promise<Playlist> {
    const playlist = await this.playlistRepository.findOne(id);
    return await this.playlistRepository.save(
      this.playlistRepository.merge(playlist, dto),
    );
  }
}
