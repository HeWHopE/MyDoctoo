import { Role } from '@prisma/client';

export const userStub = () => {
  return {
    firstName: 'First Name',
    lastName: 'Last Name',
    phone: '+380995698142',
    email: 'user@gmail.com',
    emailVerified: true,
    avatarKey: 'test',
    role: Role.PATIENT,
  };
};
