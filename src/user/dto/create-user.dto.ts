import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsAlpha, IsAscii, IsAlphanumeric, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'demouser' })
  @IsString()
  @IsAlphanumeric()
  readonly username: string;

  @ApiProperty({ example: 'topsecret' })
  @IsString()
  @IsAscii()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsAlpha()
  readonly firstname: string;

  @ApiProperty({ example: 'Smith' })
  @IsString()
  @IsAlpha()
  readonly surname: string;
}
