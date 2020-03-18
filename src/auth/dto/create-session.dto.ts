import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty()
  readonly username: string;
  @ApiProperty()
  readonly password: string;
}
