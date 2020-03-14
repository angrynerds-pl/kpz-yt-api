import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
@ApiTags('user')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  async find() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.usersService.findById(id);
  }

  @Post()
  async store(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return user;
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @AuthUser() authUser: User,
  ) {
    const user = await this.usersService.update(id, updateUserDto, authUser);
    return user;
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    const user = await this.usersService.delete(id);
    return user;
  }
}
