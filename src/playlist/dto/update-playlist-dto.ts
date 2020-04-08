import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsDefined,
  IsNotEmptyObject,
  IsOptional,
  IsAscii,
} from 'class-validator';
import { IsAlphanumericWithSpaces } from '../../custom/validator/isAlphanumericWithSpaces'
import { Identyficable } from '../../common/interfaces/identyficable';

export class UpdatePlaylistDto {
  @ApiProperty({ example: 'favourite', required: false, nullable: false })
  @IsOptional()
  @IsAlphanumericWithSpaces()
  @IsAscii()
  @IsNotEmpty()
  @IsString()
  readonly name?: string;

  @ApiProperty({ example: { id: 1 }, required: false, nullable: false })
  @IsOptional()
  @IsDefined()
  @IsNotEmptyObject()
  readonly user?: Identyficable;
}
