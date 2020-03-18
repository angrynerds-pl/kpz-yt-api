import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { User } from './entities/user.entity';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
@UseGuards(new JwtAuthGuard())
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  async find() {
    return { data: this.usersService.findAll() };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
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
    if (authUser.id != userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const updatedUser = await this.usersService.update(authUser, updateUserDto);
    return { updatedUser };
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    const userToDelete = await this.usersService.findById(id);
    const deletedUser = await this.usersService.delete(userToDelete);
    return { deletedUser };
  }

  @Get(':id/playlists')
  async findPlaylists(
    @Param('id') userId: number,
    authUser: User,
    // TODO: Add @AuthUser decorator to authUser param
  ) {
    if (authUser.id != userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const foundPlaylists = this.usersService.findPlaylists(authUser);
    return { foundPlaylists };
  }
}
