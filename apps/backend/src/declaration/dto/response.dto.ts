import { ApiProperty } from '@nestjs/swagger';
import { CreateDeclarationDto } from './create.dto';

export class ResponseDeclarationDto extends CreateDeclarationDto {
  @ApiProperty({ example: '1', description: 'Unique declration id.' })
  readonly id: number;
}
