import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProxyService } from './proxy.service';

@Controller('youtubeapi/videos')
@ApiTags('proxy')
export class ProxyController {
    constructor(private readonly proxyService: ProxyService){}

    @Get(':ytID')
    async find(@Param('ytID') videoId: string)
    {
        return { data: await this.proxyService.callYtApi(videoId) };
    }
}