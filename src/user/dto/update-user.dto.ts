import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsAlpha, IsAscii, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'topsecret', required: false })
  @IsOptional()
  @IsString()
  @IsAscii()
  @IsNotEmpty()
  password?: string;

  @ApiProperty({ example: 'John', required: false })
  @IsOptional()
  @IsString()
  @IsAlpha()
  @IsNotEmpty()
  readonly firstname?: string;

  @ApiProperty({ example: 'Smith', required: false })
  @IsOptional()
  @IsString()
  @IsAlpha()
  @IsNotEmpty()
  readonly surname?: string;
}
