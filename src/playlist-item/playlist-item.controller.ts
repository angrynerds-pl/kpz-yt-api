import { Controller, Body, Get, Put, Delete, Param, ForbiddenException, UseGuards } from '@nestjs/common';
import { PlaylistItemService } from './playlist-item.service';
import { UpdatePlaylistItemDto } from './dto/update-playlist-item.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { User } from '../user/entities/user.entity';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PlaylistService } from '../playlist/playlist.service';

@Controller('playlist-items')
@ApiTags('playlist-item')
@ApiBearerAuth()
export class PlaylistItemController {
  constructor(private readonly playlistItemService: PlaylistItemService,
              private readonly playlistService: PlaylistService) {}

  @UseGuards(new JwtAuthGuard())
  @Get()
  async find(@AuthUser() authUser: User) {
    if(!(await this.playlistItemService.canAffect(authUser, { id: 0 } ))) {
      throw new ForbiddenException();
    }
    return { data: await this.playlistItemService.findAll() };
  }

  @UseGuards(new JwtAuthGuard())
  @Get(':id')
  async findOne(@Param('id') id: number, @AuthUser() authUser: User) {
    if(!(await this.playlistItemService.canAffect(authUser, { id: id} ))) {
      throw new ForbiddenException();
    }
    return { data: await this.playlistItemService.findById(id) };
  }

  @UseGuards(new JwtAuthGuard())
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePlaylistItemDTO: UpdatePlaylistItemDto, 
    @AuthUser() authUser: User,
    ) {
      

      if(!(await this.playlistItemService.canAffect(authUser, { id: id })) ){
        throw new ForbiddenException();
      }

      if(updatePlaylistItemDTO.playlist !== undefined){
        if(! (await this.playlistService.canAffect(
            authUser, 
            { id: updatePlaylistItemDTO.playlist.id }))) {
              throw new ForbiddenException();
            }
      }



    return {
      data: await this.playlistItemService.update(id, updatePlaylistItemDTO),
    };
  }

  @UseGuards(new JwtAuthGuard())
  @Delete(':id')
  async delete(@Param('id') id: number, @AuthUser() authUser: User) {
    if(!(await this.playlistItemService.canAffect(authUser, { id: id} ))) {
      throw new ForbiddenException();
    }
    return { data: await this.playlistItemService.delete(id) };
  }
}
