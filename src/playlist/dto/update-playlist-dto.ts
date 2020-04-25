import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsDefined,
  IsNotEmptyObject,
  IsOptional,
  IsAscii,
} from 'class-validator';
import { Identifiable } from '../../common/interfaces/identifiable';

export class UpdatePlaylistDto {
  @ApiProperty({ example: 'favourite', required: false, nullable: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly name?: string;

  @ApiProperty({ example: { id: 1 }, required: false, nullable: false })
  @IsOptional()
  @IsDefined()
  @IsNotEmptyObject()
  readonly user?: Identifiable;
}
