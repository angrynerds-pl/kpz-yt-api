import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInstance, IsDefined, IsOptional, IsAlphanumeric, IsAscii } from 'class-validator';
import { User } from '../../user/entities/user.entity';

export class CreatePlaylistDto {
  @ApiProperty({ example: 'favorites', nullable: false})
  @IsAlphanumeric()
  @IsAscii()
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({ example: {id:1}, nullable: false})
  @IsInstance(User)
  @IsDefined()
  
  readonly user: User;
}
