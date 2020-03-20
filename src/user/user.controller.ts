import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
  ForbiddenException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { User } from './entities/user.entity';
import { PlaylistService } from '../playlist/playlist.service';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
@UseGuards(new JwtAuthGuard())
export class UserController {
  constructor(
    private readonly usersService: UserService,
    @Inject(forwardRef(() => PlaylistService))
    private readonly playlistService: PlaylistService,
  ) {}

  @Get()
  async find(@AuthUser() authUser: User) {
    if (!this.usersService.canAffect(authUser, { id: 0 })) {
      throw new ForbiddenException();
    }
    return { data: await this.usersService.findAll() };
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @AuthUser() authUser: User) {
    if (!this.usersService.canAffect(authUser, { id: id })) {
      throw new ForbiddenException();
    }
    return { data: await this.usersService.findById(id) };
  }

  @Post()
  async store(@Body() createUserDto: CreateUserDto) {
    return { data: await this.usersService.create(createUserDto) };
  }

  @Put(':id')
  async update(
    @Param('id') userId: number,
    @Body() updateUserDto: UpdateUserDto,
    @AuthUser() authUser: User,
  ) {
    if (!this.usersService.canAffect(authUser, { id: userId })) {
      throw new ForbiddenException();
    }
    const updatedUser = await this.usersService.update(userId, updateUserDto);
    return { data: updatedUser };
  }

  @Delete(':id')
  async delete(@Param('id') userId: number, @AuthUser() authUser: User) {
    if (!this.usersService.canAffect(authUser, { id: userId })) {
      throw new ForbiddenException();
    }
    const deletedUser = await this.usersService.delete(userId);
    return { data: deletedUser };
  }

  @Get(':id/playlists')
  async findPlaylists(@Param('id') userId: number, @AuthUser() authUser: User) {
    if (!this.usersService.canAffect(authUser, { id: userId })) {
      throw new ForbiddenException();
    }
    const foundPlaylists = await this.playlistService.findPlaylistsForUser(
      userId,
    );
    return { data: foundPlaylists };
  }
}
