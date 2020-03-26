import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsDefined,
  IsNotEmptyObject,
  IsAlphanumeric,
  IsAscii,
} from 'class-validator';
import { Identyficable } from '../../common/interfaces/identyficable';

export class CreatePlaylistDto {
  @ApiProperty({ example: 'favorites', required: true, nullable: false })
  @IsAlphanumeric()
  @IsAscii()
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({ required: true, nullable: false })
  @IsDefined()
  @IsNotEmptyObject()
  readonly user: Identyficable;
}
