import {
  Appointment,
  AppointmentStatus,
  Doctor,
  Gender,
  Patient,
  PrismaClient,
  Specialization,
  User,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

faker.seed(123);

const password = '12341234q1';
const saltRounds = 10;
const specializationNames = ['Dentist', 'Cardiologist', 'Orthopedic Surgeon', 'Pediatrician', 'Dermatologist'];

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);

  return hash;
};

const getSpecialization = async (prisma: PrismaClient): Promise<Specialization[]> => {
  const specializations = [];
  for (const name of specializationNames) {
    const specialization = await prisma.specialization.create({
      data: { name },
    });

    specializations.push(specialization);
  }

  return specializations;
};

const genPatients = async (prisma: PrismaClient, num: number = 10): Promise<Patient[]> => {
  const patients = [];
  for (let i = 0; i < num; i++) {
    const user: User = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        role: 'PATIENT',
        lastName: faker.person.lastName(),
        firstName: faker.person.firstName(),
        emailVerified: true,
        password: await hashPassword(password),
        phone: faker.phone.number(),
        avatarKey: '',
      },
    });

    const patient = await prisma.patient.create({
      data: {
        userId: user.id,
        age: faker.number.int({ min: 1, max: 100 }),
        bloodType: faker.helpers.arrayElement(['A_PLUS', 'A_MINUS', 'B_PLUS', 'B_MINUS', 'O_PLUS', 'O_MINUS']),
        country: faker.location.country(),
        city: faker.location.city(),
        street: faker.location.street(),
        gender: faker.helpers.arrayElement<Gender>(['MALE', 'FEMALE']),
        weight: faker.number.int({ min: 1, max: 200 }),
        height: faker.number.int({ min: 1, max: 200 }),
      },
    });

    patients.push(patient);
  }

  return patients;
};

const genDoctors = async (prisma: PrismaClient, specializations: Specialization[], num: number = 10) => {
  const doctors = [];
  for (let i = 0; i < num; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        role: 'DOCTOR',
        lastName: faker.person.lastName(),
        firstName: faker.person.firstName(),
        emailVerified: true,
        password: await hashPassword(password),
        phone: faker.phone.number(),
        avatarKey: '',
      },
    });

    const doctor = await prisma.doctor.create({
      data: {
        userId: user.id,
        about: faker.lorem.sentence(),
        payrate: faker.number.int({ min: 50, max: 200 }),
      },
    });

    prisma.doctorSpecialization.create({
      data: {
        doctorId: doctor.id,
        specializationId: faker.helpers.arrayElement(specializations).id,
      },
    });

    doctors.push(doctor);
  }

  return doctors;
};

const genAppointments = async (prisma: PrismaClient, patients: Patient[], doctors: Doctor[], num: number = 100) => {
  const appointments = [];
  for (let i = 0; i < num; i++) {
    const patient = faker.helpers.arrayElement(patients);
    const doctor = faker.helpers.arrayElement(doctors);

    const appointment = await prisma.appointment.create({
      data: {
        price: faker.number.int({ min: 50, max: 200 }),
        status: faker.helpers.arrayElement<AppointmentStatus>(['MISSED', 'COMPLETED', 'PLANNED', 'PENDING_PAYMENT']),
        patientId: patient.id,
        doctorId: doctor.id,
        notes: faker.lorem.sentence(),
        startedAt: faker.date.recent(),
      },
    });

    appointments.push(appointment);
  }

  return appointments;
};

const genFavourites = async (prisma: PrismaClient, patients: Patient[], doctors: Doctor[]) => {
  const favourites = [];
  for (const patient of patients) {
    const doctor = faker.helpers.arrayElement(doctors);

    const favourite = await prisma.favorite.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
      },
    });

    favourites.push(favourite);
  }

  return favourites;
};

const genAppointmentNotifications = async (prisma: PrismaClient, appointments: Appointment[]) => {
  for (const appointment of appointments) {
    const notification = await prisma.notification.create({
      data: {
        message: `You have a new appointment`,
        appointment: { connect: { id: appointment.id } },
        patient: { connect: { id: appointment.patientId } },
        doctor: { connect: { id: appointment.doctorId } },
        model: 'APPOINTMENT',
        action: 'NEW_APPOINTMENT',
      },
    });
    await prisma.patient.update({
      where: { id: appointment.patientId },
      data: { notifications: { connect: { id: notification.id } } },
    });
    await prisma.doctor.update({
      where: { id: appointment.doctorId },
      data: { Notification: { connect: { id: notification.id } } },
    });
  }
};

const generate = async (prisma: PrismaClient) => {
  const specializations = await getSpecialization(prisma);
  const patients = await genPatients(prisma);
  const doctors = await genDoctors(prisma, specializations);
  const appointments = await genAppointments(prisma, patients, doctors);
  await genAppointmentNotifications(prisma, appointments);
  await genFavourites(prisma, patients, doctors);
};

const main = async () => {
  const prisma = new PrismaClient();
  await prisma.$connect();

  try {
    await generate(prisma);
  } catch (error) {
    console.error(error);
    console.error(`\n\nError generating data, maybe you need to drop the database first?`);
    console.log(
      '\x1b[33m%s\x1b[0m',
      `NOTE: to drop the database 'db' run the following command:
docker exec -it "$(docker ps | grep postgres | cut -d' ' -f1)" psql -U user -d postgres -c "DROP DATABASE IF EXISTS db;" && pnpm prisma db push`,
    );
  }

  await prisma.$disconnect();
};

main();
