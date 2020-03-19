import { 
    Injectable,
    NotFoundException, } from '@nestjs/common';
import { CreatePlaylistItemDto } from './dto/create-playlist-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PlaylistItem } from './entities/playlist-item.entity';
import { Repository, FindManyOptions } from 'typeorm';
import { UpdatePlaylistItemDto } from './dto/update-playlist-item.dto';

@Injectable()
export class PlaylistItemService {
    constructor(
        @InjectRepository(PlaylistItem)
        private readonly playlistItemRepository: Repository<PlaylistItem>,
    ) {}

    async create(itemDTO: CreatePlaylistItemDto): Promise<PlaylistItem> {
        const playlistItem = this.playlistItemRepository.create(itemDTO);

        return await this.playlistItemRepository.save(playlistItem);
    }

    async findAll(options?: FindManyOptions<PlaylistItem>): Promise<PlaylistItem[]> {
        return this.playlistItemRepository.find(options);
    }

    async findById(id: number): Promise<PlaylistItem | undefined> {
        const playlistItem = this.playlistItemRepository.findOne(id);
        if(!playlistItem) {
            throw new NotFoundException();
        }

        return playlistItem;
    }

    async update(id: number, itemDTO: UpdatePlaylistItemDto): Promise<PlaylistItem> {
        const playListItem = await this.playlistItemRepository.findOne(id);
        if(!playListItem) {
            throw new NotFoundException();
        }

        const updatedPlayListItem = this.playlistItemRepository.merge(playListItem, itemDTO);
        return this.playlistItemRepository.save(updatedPlayListItem);
    }

    async delete(id: number): Promise<PlaylistItem> {
        const playlistItem = await this.playlistItemRepository.findOne(id);
        if(!playlistItem) {
            throw new NotFoundException();
        }

        this.playlistItemRepository.delete(playlistItem);
        return playlistItem;
    }
}
