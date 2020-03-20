import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@ApiExtraModels()
export class Identyficable {
  @ApiProperty({ type: Number, example: 1 })
  id: number;
}
