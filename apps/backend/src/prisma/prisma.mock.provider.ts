import { Provider } from '@nestjs/common';
import { prismaMock } from './prisma.mock';
import { PrismaService } from './prisma.service';

export const PrismaMockProvider: Provider = { provide: PrismaService, useValue: prismaMock };
