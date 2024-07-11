import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class ResponseUserDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique user id.' })
  readonly id: string;

  @ApiProperty({ example: 'John', description: "The user's real first name." })
  readonly firstName: string;

  @ApiProperty({ example: 'Doe', description: "The user's real last name." })
  readonly lastName: string;

  @ApiProperty({ example: '+380000000000', description: "The user's phone number in national format." })
  readonly phone: string;

  @ApiProperty({ example: 'example@example.com', description: 'Unique user mail.' })
  readonly email: string;

  @ApiProperty({ example: false, description: 'Whether the user has confirmed his mail in the service.' })
  readonly emailVerified: boolean;

  @ApiPropertyOptional({ example: 'G-123456789', description: 'Unique Google Id of the user.' })
  readonly googleId?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000.jpeg',
    description: 'The unique file id of the file in S3 storage.',
  })
  readonly avatarKey: string;

  @ApiPropertyOptional({ example: `DOCTOR`, description: 'Represent user role ' })
  readonly role?: Role;

  @Exclude()
  readonly password?: string;

  @Exclude()
  readonly twoFactorAuthToggle?: boolean;

  @Exclude()
  readonly secretCode?: string;
}
