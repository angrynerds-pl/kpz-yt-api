import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist-dto';
import { UpdatePlaylistDto } from './dto/update-playlist-dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('playlists')
@Controller('playlists')
export class PlaylistControler {
  constructor(private readonly playlistService: PlaylistService) {}

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
    // const data = await this.playlistService.findPlaylistItems(id);
    // return { data };
    return { data: [] };
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
