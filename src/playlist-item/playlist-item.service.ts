import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlaylistItemDto } from './dto/create-playlist-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CanAffect } from '../auth/contracts/can-affect.contact';
import { PlaylistItem } from './entities/playlist-item.entity';
import { Repository, FindManyOptions } from 'typeorm';
import { UpdatePlaylistItemDto } from './dto/update-playlist-item.dto';
import { User } from '../user/entities/user.entity';
import { Playlist } from '../playlist/entities/playlist.entity';
import { ConfigService } from '../config/config.service';
import { PlaylistService } from '../playlist/playlist.service';

@Injectable()
export class PlaylistItemService implements CanAffect<PlaylistItem> {
  constructor(
    @InjectRepository(PlaylistItem)
    private readonly playlistItemRepository: Repository<PlaylistItem>,
    private readonly playlistService: PlaylistService,
    private readonly configService: ConfigService,
  ) {}

  async canAffect(user: User, entity: PlaylistItem | { id: number }): Promise<boolean> {

    if(!this.configService.createAuthOptions().enabled)
    {
      return Promise.resolve(true);
    }

    const playlists = await this.playlistService.findPlaylistsForUser(user.id);

    return (await Promise.all(playlists
      .map( (value: Playlist) => this.findForPlaylist(value.id) )))
      .find((value: PlaylistItem[]) => {
        return value.find((value: PlaylistItem) => {
          return value.id == entity.id;
      }) !== undefined;
    }) !== undefined;
      
  }

  async create(itemDTO: CreatePlaylistItemDto): Promise<PlaylistItem> {
    const playlistItem = this.playlistItemRepository.create(itemDTO);

    return await this.playlistItemRepository.save(playlistItem);
  }

  async findAll(
    options?: FindManyOptions<PlaylistItem>,
  ): Promise<PlaylistItem[]> {
    return this.playlistItemRepository.find(options);
  }

  async update(
    id: number,
    itemDTO: UpdatePlaylistItemDto,
  ): Promise<PlaylistItem> {
    const playListItem = await this.playlistItemRepository.findOne(id);
    if (!playListItem) {
      throw new NotFoundException();
    }

    const updatedPlayListItem = this.playlistItemRepository.merge(
      playListItem,
      itemDTO,
    );
    return this.playlistItemRepository.save(updatedPlayListItem);
  }

  async delete(id: number): Promise<PlaylistItem> {
    const playlistItem = await this.playlistItemRepository.findOne(id);
    if (!playlistItem) {
      throw new NotFoundException();
    }

    this.playlistItemRepository.delete(playlistItem);
    return playlistItem;
  }

  async findById(id: number): Promise<PlaylistItem | undefined> {
    const playlistItem = this.playlistItemRepository.findOne(id);
    if (!playlistItem) {
      throw new NotFoundException();
    }
    
    return playlistItem;
  }

  async findForPlaylist(playlistId: number): Promise<PlaylistItem[]> {
    const playlistItems = await this.playlistItemRepository.find({
      where: {
        playlist: { id: playlistId },
      },
    });
    return playlistItems;
  }
}
