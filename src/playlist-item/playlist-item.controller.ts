import { 
    Controller,
    Body,
    Get,
    Put,
    Delete,
    Param
} from '@nestjs/common';
import {PlaylistItemService} from './playlist-item.service';
import { UpdatePlaylistItemDto } from './dto/update-playlist-item.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('playlist-items')
@ApiTags('playlist-item')
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
        return this.playListItemService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.playListItemService.findById(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() updatePlaylistItemDTO: UpdatePlaylistItemDto) {
            return this.playListItemService.update(id, updatePlaylistItemDTO);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return this.playListItemService.delete(id);
    }
}
