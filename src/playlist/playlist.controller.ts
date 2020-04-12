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
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist-dto';
import { UpdatePlaylistDto } from './dto/update-playlist-dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PlaylistItemService } from '../playlist-item/playlist-item.service';
import { CreatePlaylistItemDto } from '../playlist-item/dto/create-playlist-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { User } from '../user/entities/user.entity';

@ApiTags('playlists')
@Controller('playlists')
@ApiBearerAuth()
export class PlaylistController {
  constructor(
    private readonly playlistService: PlaylistService,
    @Inject(forwardRef(() => PlaylistItemService))
    private readonly playlistItemService: PlaylistItemService,
  ) {}

  @UseGuards(new JwtAuthGuard())
  @Get()
  async findAll(@AuthUser() authUser: User) {
    if(!(await this.playlistService.canAffect(authUser, { id: 0} ))) {
      throw new ForbiddenException();
    }

    const data = await this.playlistService.findAll();
    return { data };
  }

  @UseGuards(new JwtAuthGuard())
  @Get(':id')
  async findById(@Param('id') id: number, @AuthUser() authUser: User) {
    if(!(await this.playlistService.canAffect(authUser, { id: id} ))) {
      throw new ForbiddenException();
    }
    const data = await this.playlistService.findById(id);

    return { data };
  }

  @UseGuards(new JwtAuthGuard())
  @Get(':id/playlist-items')
  async findPlaylistItems(
    @Param('id') id: number, 
    @AuthUser() authUser: User,
  ) {
    if(!(await this.playlistService.canAffect(authUser, { id: id} ))) {
      throw new ForbiddenException();
    }
    const data = await this.playlistItemService.findForPlaylist(id);
    return { data };
  }

  @UseGuards(new JwtAuthGuard())
  @Post(':id/playlist-items')
  async storePlaylistItem(
    @Param('id') id: number,
    @Body() createPlayListItemDTO: CreatePlaylistItemDto, 
    @AuthUser() authUser: User,
    ) {
      if(!(await this.playlistService.canAffect(authUser, { id: id} ))) {
        throw new ForbiddenException();
      }
    createPlayListItemDTO.playlist.id = id;
    const data = await this.playlistItemService.create(createPlayListItemDTO);
    return { data };
  }

  @UseGuards(new JwtAuthGuard())
  @Post()
  async store(
    @Body() createPlaylistDto: CreatePlaylistDto,
    @AuthUser() authUser: User,) {
    if(createPlaylistDto.user.id !== authUser.id) {
      throw new ForbiddenException();
    }
    const data = await this.playlistService.create(createPlaylistDto);
    return { data };
  }

  @UseGuards(new JwtAuthGuard())
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePlaylistDto: UpdatePlaylistDto, 
    @AuthUser() authUser: User,
    ) {
      if(!(await this.playlistService.canAffect(authUser, { id: id} ))) {
        throw new ForbiddenException();
      }
    const data = await this.playlistService.update(id, updatePlaylistDto);
    return { data };
  }

  @UseGuards(new JwtAuthGuard())
  @Delete(':id')
  async delete(@Param('id') id: number, 
  @AuthUser() authUser: User,
  ) {
    if(!(await this.playlistService.canAffect(authUser, { id: id } ))) {
      throw new ForbiddenException();
    }
    const data = await this.playlistService.delete(id);
    return { data };
  }
}
