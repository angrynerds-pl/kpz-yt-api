import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsAlpha, IsAlphanumeric, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'demouser' })
  @IsAlphanumeric()
  readonly username: string;

  @ApiProperty({ example: 'topsecret' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'John' })
  @IsAlpha()
  readonly firstname: string;

  @ApiProperty({ example: 'Smith' })
  @IsAlpha()
  readonly lastname: string;
}
