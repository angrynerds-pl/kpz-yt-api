import { Controller, Body, Get, Put, Delete, Param } from '@nestjs/common';
import { PlaylistItemService } from './playlist-item.service';
import { UpdatePlaylistItemDto } from './dto/update-playlist-item.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('playlist-items')
@ApiTags('playlist-item')
export class PlaylistItemController {
  constructor(private readonly playListItemService: PlaylistItemService) {}

  @Get()
  async find() {
    return { data: await this.playListItemService.findAll() };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return { data: await this.playListItemService.findById(id) };
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePlaylistItemDTO: UpdatePlaylistItemDto,
  ) {
    return {
      data: await this.playListItemService.update(id, updatePlaylistItemDTO),
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return { data: await this.playListItemService.delete(id) };
  }
}
