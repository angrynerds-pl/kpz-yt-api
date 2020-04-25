import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProxyService } from './proxy.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('youtubeapi/videos')
@ApiTags('proxy')
@ApiBearerAuth()
export class ProxyController {
    constructor(private readonly proxyService: ProxyService){}

    @UseGuards(new JwtAuthGuard())
    @Get(':ytID')
    find(@Param('ytID') videoId: string)
    {
        return this.proxyService.callYtApi(videoId);
    }
}