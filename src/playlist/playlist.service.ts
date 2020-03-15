import {
    Injectable,
    ConflictException,
    NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './entities/playlist.entity';
import { Repository, FindManyOptions } from 'typeorm';
import { ListItem } from 'src/listItem/entities/listItem.entity';
import { CreatePlaylistDto } from "./dto/createPlaylistDto";
import { UpdatePlaylistDto } from "./dto/updatePlaylistDto";


@Injectable()
export class PlaylistService {
    constructor(
        @InjectRepository(Playlist)
        private readonly playlistRepository: Repository<Playlist>,
        private readonly listItemRepository: Repository<ListItem>,
        ) {}

    async findAll(options?: FindManyOptions<Playlist>): Promise<Playlist[]> {
        return await this.playlistRepository.find(options);
    }

    async findById(id:number): Promise<Playlist | undefined> {
        const playlist = this.playlistRepository.findOne(id);
        if (!playlist) {
            throw new NotFoundException();
        }
        return playlist;
    }

    async findListItems(playlist : Playlist): Promise<ListItem[]> {
        return this.listItemRepository.find(
            {
                where: {
                    playlist: playlist,
                },
            }
        );
    }

    async create(dto: CreatePlaylistDto): Promise<Playlist> {
        return await this.playlistRepository.save(
            this.playlistRepository.create(dto)
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
            this.playlistRepository.merge(playlist, dto)
        );
    }
}