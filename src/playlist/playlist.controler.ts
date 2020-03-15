import { Controller, Get, Param, Post, Body, Put, Delete } from "@nestjs/common";
import { PlaylistService } from "./playlist.service";
import { CreatePlaylistDto } from "./dto/createPlaylistDto";
import { UpdatePlaylistDto } from "./dto/updatePlaylistDto";

@Controller('playlist')
export class PlaylistControler {
    constructor(private readonly playlistService: PlaylistService) {}

    @Get()
    async find() {
        return this.playlistService.findAll();
    }

    @Get(':id')
    async findById(@Param('id')id: number) {
        return this.playlistService.findById(id);
    }

    @Post()
    async store(@Body() createPlaylistDto : CreatePlaylistDto) {
        return await this.playlistService.create(createPlaylistDto);
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() updatePlaylistDto: UpdatePlaylistDto,
    ) {
        return await this.playlistService.update(id, updatePlaylistDto);
    }

    @Delete(':id')
    async delete(@Param('id')id: number) {
        return this.playlistService.delete(id);
    }
}