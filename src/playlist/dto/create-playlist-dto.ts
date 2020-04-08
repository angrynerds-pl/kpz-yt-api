import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsDefined,
  IsNotEmptyObject,
  IsAscii,
} from 'class-validator';
import { IsAlphanumericWithSpaces } from '../../custom/validator/isAlphanumericWithSpaces'
import { Identyficable } from '../../common/interfaces/identyficable';

export class CreatePlaylistDto {
  @ApiProperty({ example: 'favorites', required: true, nullable: false })
  @IsAlphanumericWithSpaces()
  @IsAscii()
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({ required: true, nullable: false })
  @IsDefined()
  @IsNotEmptyObject()
  readonly user: Identyficable;
}
