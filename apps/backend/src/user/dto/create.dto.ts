import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { IsNotEmptyString } from '../../validators/IsNotEmptyString';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: "The user's real first name." })
  @IsNotEmptyString()
  readonly firstName: string;

  @ApiProperty({ example: 'Doe', description: "The user's real last name." })
  @IsNotEmptyString()
  readonly lastName: string;

  @ApiProperty({ example: '+380000000000', description: "The user's phone number in national format." })
  @IsPhoneNumber()
  readonly phone: string;

  @ApiProperty({ example: 'example@example.com', description: 'Unique user mail.' })
  @IsEmail()
  readonly email: string;

  @ApiPropertyOptional({ example: 'password', description: 'User password.' })
  @IsOptional()
  @IsNotEmptyString()
  password?: string;

  @ApiPropertyOptional({ example: 'G-123456789', description: 'Unique Google Id of the user.' })
  @IsOptional()
  @IsNotEmptyString()
  googleId?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000.jpeg',
    description: 'The unique file id of the file in S3 storage.',
  })
  @IsOptional()
  @IsString()
  avatarKey: string;

  @ApiProperty({ example: Role.PATIENT, description: 'The role of the user.' })
  @IsEnum(Role)
  role: Role;
}
