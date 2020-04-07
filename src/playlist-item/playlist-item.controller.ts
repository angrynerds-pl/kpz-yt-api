import { Controller, Body, Get, Put, Delete, Param, ForbiddenException } from '@nestjs/common';
import { PlaylistItemService } from './playlist-item.service';
import { UpdatePlaylistItemDto } from './dto/update-playlist-item.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../user/entities/user.entity';
import { AuthUser } from '../auth/decorators/auth-user.decorator';

@Controller('playlist-items')
@ApiTags('playlist-item')
export class PlaylistItemController {
  constructor(private readonly playlistItemService: PlaylistItemService) {}

  @Get()
  async find(@AuthUser() authUser: User) {
    if(!(await this.playlistItemService.canAffect(authUser, { id: 0 } ))) {
      throw new ForbiddenException();
    }
    return { data: await this.playlistItemService.findAll() };
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @AuthUser() authUser: User) {
    if(!(await this.playlistItemService.canAffect(authUser, { id: id} ))) {
      throw new ForbiddenException();
    }
    return { data: await this.playlistItemService.findById(id) };
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePlaylistItemDTO: UpdatePlaylistItemDto, 
    @AuthUser() authUser: User,
    ) {
      if(!(await this.playlistItemService.canAffect(authUser, { id: id} ))) {
        throw new ForbiddenException();
      }
    return {
      data: await this.playlistItemService.update(id, updatePlaylistItemDTO),
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @AuthUser() authUser: User) {
    if(!(await this.playlistItemService.canAffect(authUser, { id: id} ))) {
      throw new ForbiddenException();
    }
    return { data: await this.playlistItemService.delete(id) };
  }
}
