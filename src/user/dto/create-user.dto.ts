import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'demouser' })
  readonly username: string;

  @ApiProperty({ example: 'topsecret' })
  password: string;

  @ApiProperty({ example: 'John' })
  readonly firstname: string;

  @ApiProperty({ example: 'Smith' })
  readonly surname: string;
}
