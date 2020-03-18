import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePlaylistDto {
  @ApiProperty({ example: 'favourite' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
