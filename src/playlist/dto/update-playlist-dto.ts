import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInstance, IsDefined, IsOptional, IsAlphanumeric, IsAscii } from 'class-validator';
import { User } from '../../user/entities/user.entity';

export class UpdatePlaylistDto {
  @ApiProperty({ example: 'favourite', required: false, nullable: false})
  @IsOptional()
  @IsAlphanumeric()
  @IsAscii()
  @IsNotEmpty()
  @IsString()
  readonly name?: string;

  @ApiProperty({ example: {id:1}, required: false, nullable: false})
  @IsOptional()
  @IsInstance(User)
  @IsDefined()
  readonly user?: User;
}
