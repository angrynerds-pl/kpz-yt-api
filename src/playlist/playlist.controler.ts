import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/createPlaylistDto';
import { UpdatePlaylistDto } from './dto/updatePlaylistDto';
import { ApiTags } from '@nestjs/swagger';
import { Playlist } from './entities/playlist.entity';

@ApiTags('playlist')
@Controller('playlist')
export class PlaylistControler {
  constructor(private readonly playlistService: PlaylistService) {}

  @Get()
  async find() {
    return {
        data: this.playlistService.findAll(),
    }
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    const playlist: Playlist = await this.playlistService.findById(id);
    if (!playlist) {
        throw new NotFoundException();
      }
    return {
        data: playlist,
    }
  }

  @Get(':id/playlistItems')
  async findPlaylistItems(@Param('id') id: number) {
    return {
        data: await this.playlistService.findPlaylistItems(
                await this.playlistService.findById(id),
            ),
        }
  }

  @Post()
  async store(@Body() createPlaylistDto: CreatePlaylistDto) {
    return {
        data: await this.playlistService.create(createPlaylistDto),
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ) {
    return {
        data: await this.playlistService.update(id, updatePlaylistDto),
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return {
        data: this.playlistService.delete(id),
    }
  }
}
