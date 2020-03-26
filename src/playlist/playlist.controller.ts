import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist-dto';
import { UpdatePlaylistDto } from './dto/update-playlist-dto';
import { ApiTags } from '@nestjs/swagger';
import { PlaylistItemService } from '../playlist-item/playlist-item.service';
import { CreatePlaylistItemDto } from '../playlist-item/dto/create-playlist-item.dto';

@ApiTags('playlists')
@Controller('playlists')
export class PlaylistController {
  constructor(
    private readonly playlistService: PlaylistService,
    @Inject(forwardRef(() => PlaylistItemService))
    private readonly playlistItemService: PlaylistItemService,
  ) {}

  @Get()
  async findAll() {
    const data = await this.playlistService.findAll();
    return { data };
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    const data = await this.playlistService.findById(id);

    return { data };
  }

  @Get(':id/playlist-items')
  async findPlaylistItems(@Param('id') id: number) {
    const data = await this.playlistItemService.findForPlaylist(id);
    return { data };
  }

  @Post(':id/playlist-items')
  async storePlaylistItem(
    @Param('id') id: number,
    @Body() createPlayListItemDTO: CreatePlaylistItemDto,
  ) {
    createPlayListItemDTO.playlist.id = id;
    const data = await this.playlistItemService.create(createPlayListItemDTO);
    return { data };
  }

  @Post()
  async store(@Body() createPlaylistDto: CreatePlaylistDto) {
    const data = await this.playlistService.create(createPlaylistDto);
    return { data };
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ) {
    const data = await this.playlistService.update(id, updatePlaylistDto);
    return { data };
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    const data = await this.playlistService.delete(id);
    return { data };
  }
}
