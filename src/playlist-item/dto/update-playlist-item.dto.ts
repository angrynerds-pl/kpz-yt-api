import { ApiProperty } from '@nestjs/swagger';
import { IsOptional} from 'class-validator';

export class UpdatePlaylistItemDto {
  @ApiProperty({ example: 'How Earth Moves', required: false })
  @IsOptional()
  title?: string;

  @ApiProperty({ example: '0O6OCn4CXuw', required: false })
  @IsOptional()
  ytID?: string;
}
