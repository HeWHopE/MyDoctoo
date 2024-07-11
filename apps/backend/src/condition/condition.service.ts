import { Injectable } from '@nestjs/common';
import { CreateConditionDto } from './dto/create.dto';
import { UpdateConditionDto } from './dto/update.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { KnowledgeBaseUpdatedEvent } from '../virtual-assistant/events/knowledge-base-updated.event';

@Injectable()
export class ConditionService {
  constructor(
    private prismaService: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async createCondition(createConditionDto: CreateConditionDto) {
    const condition = await this.prismaService.condition.create({ data: createConditionDto });

    this.eventEmitter.emit('knowledge.base.update', new KnowledgeBaseUpdatedEvent(process.env.OPENAI_API_ASSISTANT_ID));

    return condition;
  }

  async findAllConditions() {
    const conditions = await this.prismaService.condition.findMany();
    return conditions;
  }

  async findCondition(id: string) {
    const condition = await this.prismaService.condition.findUnique({ where: { id } });
    return condition;
  }

  async updateCondition(id: string, body: UpdateConditionDto) {
    const condition = await this.prismaService.condition.update({
      where: { id },
      data: body,
    });
    return condition;
  }

  async removeCondition(id: string) {
    const condition = await this.prismaService.condition.delete({ where: { id } });
    return condition;
  }
}
