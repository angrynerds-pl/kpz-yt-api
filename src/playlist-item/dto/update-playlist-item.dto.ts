import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmptyObject } from 'class-validator';
import { Identifiable } from '../../common/interfaces/identifiable';

export class UpdatePlaylistItemDto {
  @ApiProperty({ example: '0O6OCn4CXuw', required: false })
  @IsOptional()
  @IsString()
  ytID?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmptyObject()
  readonly playlist?: Identifiable;
}
