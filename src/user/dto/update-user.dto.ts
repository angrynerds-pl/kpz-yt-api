import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'topsecret', required: false })
  @IsOptional()
  password?: string;

  @ApiProperty({ example: 'John', required: false })
  @IsOptional()
  readonly firstname?: string;

  @ApiProperty({ example: 'Smith', required: false })
  @IsOptional()
  readonly surname?: string;
}
