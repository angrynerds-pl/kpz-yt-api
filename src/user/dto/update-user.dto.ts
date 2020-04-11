import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsAlpha } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'topsecret', required: false })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ example: 'John', required: false })
  @IsOptional()
  @IsString()
  @IsAlpha()
  readonly firstname?: string;

  @ApiProperty({ example: 'Smith', required: false })
  @IsOptional()
  @IsString()
  @IsAlpha()
  readonly lastname?: string;
}
