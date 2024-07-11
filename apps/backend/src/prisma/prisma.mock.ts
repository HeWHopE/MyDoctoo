import { Prisma } from '@prisma/client';
import createPrismaMock from 'prisma-mock';

export const prismaMock = createPrismaMock({}, Prisma.dmmf.datamodel);
