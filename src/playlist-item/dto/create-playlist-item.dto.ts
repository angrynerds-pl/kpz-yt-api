import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNotEmptyObject } from 'class-validator';
import { Identifiable } from '../../common/interfaces/identifiable';

export class CreatePlaylistItemDto {
  @ApiProperty({ example: '9zfXD8wjzfc', required: true })
  @IsString()
  @IsNotEmpty()
  readonly ytID: string;

  @ApiProperty({ required: true })
  @IsNotEmptyObject()
  readonly playlist: Identifiable;
}
