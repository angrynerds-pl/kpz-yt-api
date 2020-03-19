import { ApiProperty } from '@nestjs/swagger';
import { Playlist } from '../../playlist/entities/playlist.entity';
import { IsOptional, IsString, IsNotEmpty, IsNotEmptyObject} from 'class-validator';

export class CreatePlaylistItemDto {
  @ApiProperty({ example: 'Cool video', required: true })
  @IsOptional()
  readonly title: string;

  @ApiProperty({ example: '9zfXD8wjzfc', required: true })
  @IsString()
  @IsNotEmpty()
  readonly ytID: string;

  @ApiProperty({example: '{ id: 1 }', required: true})
  @IsNotEmptyObject()
  readonly playlist: Playlist;
}
