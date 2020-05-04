import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsDefined,
  IsNotEmptyObject,
  IsAscii,
} from 'class-validator';
import { Identifiable } from '../../common/interfaces/identifiable';

export class CreatePlaylistDto {
  @ApiProperty({ example: 'favorites', required: true, nullable: false })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ required: true, nullable: false })
  @IsDefined()
  @IsNotEmptyObject()
  readonly user: Identifiable;
}
