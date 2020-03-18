import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePlaylistDto {
  @ApiProperty({ example: 'favorites' })
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
