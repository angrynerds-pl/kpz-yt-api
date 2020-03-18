import { ApiProperty } from '@nestjs/swagger';
import { IsOptional} from 'class-validator';

export class UpdatePlaylistItemDto {
  @ApiProperty({ example: 'Awesome pasztet gradma', required: false })
  @IsOptional()
  title?: string;

  @ApiProperty({ example: '0O6OCn4CXuw', required: false }) //another easter egg 
  @IsOptional()
  ytID?: string;
}
