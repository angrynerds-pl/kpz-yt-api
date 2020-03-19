import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('sessions')
@Controller('sessions')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  public async store(@Body() createSessionDTO: CreateSessionDto) {
    const validUser = await this.authService.validateUser(createSessionDTO);
    return await this.authService.login(validUser);
  }
}
