import { ApiProperty } from '@nestjs/swagger';

export class UpdatePlaylistDto {
  @ApiProperty({ example: 'favourite' })
  name: string;
}
