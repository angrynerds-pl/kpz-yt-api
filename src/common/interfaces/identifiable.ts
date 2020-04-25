import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@ApiExtraModels()
export class Identifiable {
  @ApiProperty({ type: Number, example: 1 })
  id: number;
}
