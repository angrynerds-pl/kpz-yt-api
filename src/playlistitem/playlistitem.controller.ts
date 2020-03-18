import { 
    Controller,
    Post,
    Body,
    Get,
    Put,
    Delete,
    Param
} from '@nestjs/common';
import {PlaylistItemService} from './playlistitem.service';
import { CreatePlaylistItemDto } from './dto/create-playlistitem.dto';


@Controller('playlist-items')
export class PlaylistItemController {
    constructor(private readonly playListItemService: PlaylistItemService) {}

    //TODO: Put this into PlayListController -> hasn't been created yet
    
    // @Post('/playlists/:id/playlistitems')
    // async store(
    //     @Param('id') id: number,
    //     @Body() createPlayListItemDTO: CreatePlaylistItemDto) {
    //     //call service method
    // }

    // @Get('playlists/:id/playlistitems')
    // async findAll() {
    //     //call service method
    // }

    @Get()
    async find() {
        //call service method
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        //call service method
    }

    @Put(':id')
    async update(@Param('id') id: number) {
        //call service method
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        //call service method
    }
}
