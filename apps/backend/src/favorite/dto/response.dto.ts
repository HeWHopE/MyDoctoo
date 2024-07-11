import { ApiProperty } from '@nestjs/swagger';
import { CreateFavoriteDto } from './create.dto';

export class ResponseFavoriteDto extends CreateFavoriteDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique favorite id.' })
  id: string;
}
