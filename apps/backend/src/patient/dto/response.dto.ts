import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Allergy, BloodType, Condition, Gender, User } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ResponseAllergyDto } from './responseAllergy.dto';
import { ResponseConditionDto } from './responseCondition.dto';

export class ResponsePatientDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique patient id.' })
  readonly id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The unique user id of the user to which the patient is bound.',
  })
  readonly userId: string;

  @ApiProperty({ example: 65, description: "Patient's weight." })
  readonly weight: number;

  @ApiProperty({ example: 185, description: 'Patient height.' })
  readonly height: number;

  @ApiProperty({ example: 35, description: "Patient's age." })
  readonly age: number;

  @ApiProperty({ enum: BloodType, example: BloodType.AB_MINUS, description: "The patient's blood type." })
  readonly bloodType: BloodType;

  @ApiProperty({ enum: Gender, example: Gender.MALE, description: 'Patient gender.' })
  readonly gender: Gender;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'A unique key to the patient identification file.',
  })
  readonly identityCardKey: string;

  @ApiProperty({
    example: 'Passport',
    description: 'A name of patient identification file.',
  })
  readonly identityCardType: string;

  @ApiProperty({ example: 'USA', description: 'The country where the hospital is located.' })
  readonly country: string;

  @ApiPropertyOptional({ example: 'Oregon', description: 'The address of the state where the hospital is located.' })
  readonly state?: string;

  @ApiProperty({ example: 'Salem', description: 'The name of the city where this hospital is located.' })
  readonly city: string;

  @ApiProperty({ example: 'St. Big Bells', description: 'The name of the street where this hospital is located.' })
  readonly street: string;

  @ApiPropertyOptional({ example: '35A', description: "Patient's apartment number." })
  readonly apartment?: string;

  @ApiProperty({ example: 0o200, description: "The hospital's zip code." })
  readonly zipCode?: number;

  @ApiProperty({ default: false, description: "Status of alerts to the patient's email." })
  emailNotificationToggle: boolean;

  @ApiProperty({ example: false, description: 'Whether to request a two-factor confirmation when making a payment.' })
  requestBillPaymentApproval: boolean;

  @ApiProperty({ description: 'The two factor authentication toggle of the patient' })
  twoFactorAuthToggle: boolean;

  @Expose()
  @Transform(({ obj }) => obj.user && obj.user.firstName)
  @ApiProperty({
    description: 'First name of the doctor',
    example: 'John',
  })
  readonly firstName: string;

  @Expose()
  @Transform(({ obj }) => obj.user && obj.user.lastName)
  @ApiProperty({
    description: 'Last name of the doctor',
    example: 'Doe',
  })
  readonly lastName: string;

  @Expose()
  @Transform(({ obj }) => obj.user && obj.user.avatarKey)
  @ApiProperty({
    description: 'Key of the avatar of the doctor',
    example: 'acde070d-8c4c-4f0d-9d8a-162843c10333.jpg',
  })
  readonly avatarKey: string;

  @Expose()
  @Transform(({ obj }) => obj.user && obj.user.phone)
  @ApiProperty({
    description: 'The phone of the doctor',
    example: '+38099561735634',
  })
  readonly phone: string;

  @Expose()
  @Transform(({ obj }) => obj.user && obj.user.email)
  @ApiProperty({
    description: 'Email of the doctor',
    example: 'johndoe@mail.com',
  })
  readonly email: string;

  @Expose()
  @Transform(({ obj }) =>
    obj.allergies ? obj.allergies.map(allergy => allergy.allergy as Allergy) : ([] as Allergy[]),
  )
  @ApiProperty({
    type: ResponseAllergyDto,
    isArray: true,
    description: 'List of allergies of the patient.',
    example: { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Peanuts' },
  })
  readonly allergies: Allergy[];

  @Expose()
  @Transform(({ obj }) =>
    obj.PatientCondition
      ? obj.PatientCondition.map(condition => condition.condition as Condition)
      : ([] as Condition[]),
  )
  @ApiProperty({
    type: ResponseConditionDto,
    isArray: true,
    description: 'List of conditions of the patient.',
    example: { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Diabetes' },
  })
  readonly conditions: Condition[];

  @Exclude()
  readonly user: User;
}
