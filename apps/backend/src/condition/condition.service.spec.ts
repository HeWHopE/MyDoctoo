import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ConditionService } from './condition.service';
import { CreateConditionDto } from './dto/create.dto';
import { UpdateConditionDto } from './dto/update.dto';
import { EventEmitterModule } from '@nestjs/event-emitter';

describe('ConditionService', () => {
  let conditionService: ConditionService;
  let prisma: PrismaService;

  const conditionDto: CreateConditionDto = {
    name: 'test',
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      providers: [ConditionService, PrismaService],
    }).compile();

    conditionService = moduleRef.get<ConditionService>(ConditionService);
    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await prisma.condition.deleteMany();
    await prisma.user.deleteMany();
  });

  it('should be defined', () => {
    expect(conditionService).toBeDefined();
  });

  it('should create condition', async () => {
    const createdCondtion = await conditionService.createCondition(conditionDto);

    expect(createdCondtion).toMatchObject(conditionDto);
    expect(createdCondtion.id).toBeDefined();
  });

  it('should return condition by id', async () => {
    const { id } = await prisma.condition.create({ data: conditionDto });

    const condition = await conditionService.findCondition(id);

    expect(condition).toMatchObject({ ...conditionDto, id });
  });

  it('should update condition', async () => {
    const { id } = await prisma.condition.create({ data: conditionDto });

    const data: UpdateConditionDto = { name: 'test-updated' };

    const updatedCondition = await conditionService.updateCondition(id, data);

    expect(updatedCondition).toMatchObject({ ...conditionDto, ...data, id });
  });

  it('should remove condition', async () => {
    const { id } = await prisma.condition.create({ data: conditionDto });

    const removedCondition = await conditionService.removeCondition(id);

    expect(removedCondition).toMatchObject({ ...conditionDto, id });
  });
});
