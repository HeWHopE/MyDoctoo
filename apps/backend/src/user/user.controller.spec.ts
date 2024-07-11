import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { mockUndefined, pipe } from '../utils/test-injection-mock';

// TODO: Cover a large area of code with tests.
describe('UserController', () => {
  let controller: UserController;
  let userId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        PrismaService,
        { provide: 'MAIL_SERVICE', useValue: { send: jest.fn(), emit: jest.fn() } },
      ],
    })
      .useMocker(pipe(mockUndefined))
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('Should be defined', () => expect(controller).toBeDefined());

  it('Should create a new user', async () => {
    const user = await controller.createUser({
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'example@mail.com',
      phone: '+380501804050',
      avatarKey: 'ABCD-DEFG',
      password: '$2y$10$rcDPr0lHPIa4iwZeZWunBeamx7ruC.g0hFl9QrEEARRaAQpRX3MhC',
      role: 'PATIENT',
    });

    userId = user.id;

    expect(user).toMatchObject({ firstName: 'First Name', lastName: 'Last Name' });
  });

  it('Should change firstName to "New First Name"', async () => {
    const user = await controller.patchUser(userId, { firstName: 'New First Name' });

    expect(user).toMatchObject({ firstName: 'New First Name' });
  });

  it('Should return user object', async () => {
    const user = await controller.getUser(userId);

    expect(Object.keys(user).length).toBe(9);
  });

  it('Should deleted user', async () => {
    const user = await controller.deleteUser(userId);

    expect(user).toBeUndefined();
  });
});
