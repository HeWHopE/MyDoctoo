import { BloodType, Gender } from '@prisma/client';

export const patientStub = () => {
  return {
    weight: 70,
    height: 180,
    age: 30,
    identityCardKey: 'identity_card_key_here',
    bloodType: BloodType.AB_MINUS,
    gender: Gender.MALE,
    country: 'Country Name',
    state: 'State Name',
    city: 'City Name',
    street: 'Street Address',
    apartment: 'Apartment Number',
    zipCode: 12345,
  };
};
