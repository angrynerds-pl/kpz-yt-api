import { ApiProperty } from '@nestjs/swagger';
import { Playlist } from '../../playlist/entities/playlist.entity';

export class CreatePlaylistItemDto {
  @ApiProperty({ example: 'Cool video', required: false })
  readonly title: string;

  @ApiProperty({ example: '9zfXD8wjzfc' }) //little hint -> it's an easter egg 
  readonly ytID: string;

  @ApiProperty({example: '{ id: 1 }', required: true})
  readonly playlist: Playlist;
}
