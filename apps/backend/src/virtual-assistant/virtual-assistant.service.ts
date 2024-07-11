import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { createReadStream } from 'fs';
import { writeFile } from 'fs/promises';
import OpenAI from 'openai';
import { ConditionService } from '../condition/condition.service';
import { PatientService } from 'src/patient/patient.service';
import { plainToInstance } from 'class-transformer';
import { ResponseAssistantChatMessageDto } from './dto/response.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';
import { ResponsePromptDto } from './dto/responsePrompt.dto';
import { SpecializationService } from 'src/specialization/specialization.service';
import { DoctorService } from 'src/doctor/doctor.service';
import { ResponseDoctorDto } from 'src/doctor/dto/response.dto';

@Injectable()
export class VirtualAssistantService {
  constructor(
    private conditionService: ConditionService,
    private specializationService: SpecializationService,
    private prismaService: PrismaService,
    private patientService: PatientService,
    private doctorService: DoctorService,
  ) {}

  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  private async generateKnowledgeBase(): Promise<string[]> {
    const specializations = await this.specializationService.getSpecializations();

    let specializationText: string = 'List of specializations:';

    specializations.forEach((specialization, index) => {
      specializationText += `\n\n${index + 1}. Name: ${specialization.name}`;
      specializationText += `\nId of ${specialization.name}: ${specialization.id}`;
    });

    await writeFile('src/virtual-assistant/data/specializationList.txt', specializationText);

    const conditions = await this.conditionService.findAllConditions();

    let conditionText = 'List of conditions:';

    conditions.forEach((condition, index) => {
      conditionText += `\n\n${index + 1}. Condition - ${condition.name}`;
      conditionText += `\nId: ${condition.id}`;
    });

    await writeFile('src/virtual-assistant/data/conditionList.txt', conditionText);

    return specializations.map(specialization => specialization.id);
  }

  private async isChatConversationExists(patientId: string) {
    const chat = await this.prismaService.assistantChat.findFirst({ where: { patientId } });

    return chat ? chat.id : false;
  }

  private async initiateRun(assistant: OpenAI.Beta.Assistants.Assistant, thread: OpenAI.Beta.Threads.Thread) {
    let message: {
      role: 'assistant';
      content: [{ type: 'set_text'; text: string }];
      doctors: ResponseDoctorDto[];
    };
    const handleRequiresAction = async run => {
      if (
        run.required_action &&
        run.required_action.submit_tool_outputs &&
        run.required_action.submit_tool_outputs.tool_calls
      ) {
        const toolOutputs = run.required_action.submit_tool_outputs.tool_calls.map(async tool => {
          if (tool.function.name === 'get_doctors_by_specialization_id') {
            try {
              const data: { specializationId: string } = JSON.parse(tool.function.arguments);
              const doctors = await this.doctorService.getDoctorsBySpecializationId(data.specializationId);
              if (!doctors) {
                return {
                  // eslint-disable-next-line @typescript-eslint/naming-convention
                  tool_call_id: tool.id,
                  output: "Couldn't find any doctors with this specialization.",
                };
              }
              message = {
                role: 'assistant',
                content: [{ type: 'set_text', text: 'Here is the list of doctors I found.' }],
                doctors: doctors,
              };
              return {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                tool_call_id: tool.id,
                output: 'Successfully retrieved doctors by specialization.',
              };
            } catch (error) {
              console.log(error);
              return {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                tool_call_id: tool.id,
                output: "Failed to find doctors, try using data from 'specializationList.txt' file.",
              };
            }
          }
        });

        if (toolOutputs.length > 0) {
          const tools = await Promise.all(toolOutputs);
          run = await this.openai.beta.threads.runs.submitToolOutputsAndPoll(thread.id, run.id, {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            tool_outputs: tools,
          });
        }

        return handleRunStatus(run);
      }
    };

    const handleRunStatus = async run => {
      try {
        if (run.status === 'completed') {
          const messages = await this.openai.beta.threads.messages.list(thread.id);
          return messages.data;
        } else if (run.status === 'requires_action') {
          return await handleRequiresAction(run);
        } else {
          console.error('Run did not complete:', run);
        }
      } catch (err) {
        console.log('handleRunStatusError:', err);
      }
    };

    const run = await this.openai.beta.threads.runs.createAndPoll(thread.id, {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      assistant_id: assistant.id,
    });

    await handleRunStatus(run);

    return message ? message : (await this.openai.beta.threads.messages.list(thread.id)).data[0];
  }

  @OnEvent('knowledge.base.update')
  async updateAssistantKnowledgeBase({ assistantId }: { assistantId: string }): Promise<void> {
    await this.generateKnowledgeBase();

    const fileStreams = [
      'src/virtual-assistant/data/specializationList.txt',
      'src/virtual-assistant/data/conditionList.txt',
    ].map(path => createReadStream(path));

    const vectorStore = await this.openai.beta.vectorStores.create({
      name: 'Medical Data',
    });

    await this.openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, { files: fileStreams });

    await this.openai.beta.assistants.update(assistantId, {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
      tools: [
        { type: 'file_search' },
        {
          type: 'function',
          function: {
            name: 'get_doctors_by_specialization_id',
            description:
              'Use this function to get a list of doctors by their specialization. Should be used when creating an appointment.',
            parameters: {
              type: 'object',
              properties: {
                specializationId: {
                  type: 'string',
                  description:
                    "The uuid of specialization of the doctor specified during conversation. This id must be taken from 'specializationList.txt' from Medical Data vector store.",
                },
              },
              required: ['specializationId'],
            },
          },
        },
      ],
    });
  }

  // Should be ONLY called only after massive assistant modifications, then env variable OPENAI_ASSISTANT_ID should be also changed to new assistant id, available in openai playground.
  async initializeVirtualAssistant(promptId: string): Promise<void> {
    const prompt = await this.prismaService.prompt.findUnique({ where: { id: promptId } });

    const assistant = await this.openai.beta.assistants.create({
      name: 'Healthcare Assistant',
      instructions: `Current date time: ${new Date().toISOString()}\n\n${prompt.text}`,
      model: 'gpt-4o',
    });

    await this.updateAssistantKnowledgeBase({ assistantId: assistant.id });
  }
  async initializeConversation(userId: string) {
    const patient = await this.patientService.getPatientByUserId(userId);

    if (!patient) {
      throw new NotFoundException('Patient does not exist');
    }

    const chatId = await this.isChatConversationExists(patient.id);

    if (chatId) {
      throw new BadRequestException('Conversation already exists');
    }

    const assistantChat = await this.prismaService.assistantChat.create({ data: { patientId: patient.id } });

    const assistantChatMessage = await this.prismaService.assistantMessage.create({
      data: {
        role: 'ASSISTANT',
        content: `Hello${patient.firstName ? ` ${patient.firstName}, ` : ''}how can I help you today?`,
        assistantChatId: assistantChat.id,
      },
    });

    if (!assistantChatMessage) {
      throw new InternalServerErrorException('No messages were created');
    }

    return plainToInstance(ResponseAssistantChatMessageDto, { ...assistantChatMessage, doctors: [] });
  }

  async createMessage({ patientId, content }: { patientId: string; content: string }) {
    const { AssistantMessage: messages } = await this.prismaService.assistantChat.findFirst({
      where: { patientId },
      select: { AssistantMessage: { select: { content: true, role: true } } },
    });

    const prompt = await this.prismaService.prompt.findFirst();

    if (!prompt) {
      throw new NotFoundException('Prompt does not exist');
    }

    const patient = await this.patientService.getPatient(patientId);

    if (!patient) {
      throw new NotFoundException('Patient does not exist');
    }

    const assistant = await this.openai.beta.assistants.retrieve(process.env.OPENAI_API_ASSISTANT_ID);

    this.openai.beta.assistants.update(assistant.id, {
      instructions: `Current date time: ${new Date().toISOString()}\n\n${prompt.text}`,
    });

    const formattedMessages: Array<{ role: 'assistant' | 'user'; content: string }> = messages.map(message => {
      return {
        role: message.role === 'ASSISTANT' ? 'assistant' : 'user',
        content: message.content,
      };
    });

    const thread = await this.openai.beta.threads.create({
      messages: [...formattedMessages, { role: 'user', content }],
    });

    const chatId = await this.isChatConversationExists(patientId);

    if (!chatId) {
      throw new NotFoundException('Chat conversation does not exist');
    }

    const userMessage = await this.prismaService.assistantMessage.create({
      data: { role: 'USER', content, assistantChatId: chatId },
    });

    if (!userMessage) {
      throw new InternalServerErrorException('User message was not created');
    }

    const lastMessage = await this.initiateRun(assistant, thread);

    let messageContent: string;

    if (lastMessage.content[0].type === 'text') {
      messageContent = lastMessage.content[0].text.value;
    } else if (lastMessage.content[0].type === 'set_text') {
      messageContent = lastMessage.content[0].text;
    } else {
      messageContent = '';
    }

    const doctors = 'doctors' in lastMessage ? lastMessage.doctors : null;

    const assistantMessage = await this.prismaService.assistantMessage.create({
      data: {
        role: 'ASSISTANT',
        content: messageContent,
        assistantChatId: chatId,
      },
    });

    if (!assistantMessage) {
      throw new InternalServerErrorException('Assistant message was not created');
    }

    if (doctors) {
      return plainToInstance(ResponseAssistantChatMessageDto, { ...assistantMessage, doctors });
    }

    return plainToInstance(ResponseAssistantChatMessageDto, { ...assistantMessage, doctors: [] });
  }

  async getChatMessages(userId: string) {
    const patient = await this.patientService.getPatientByUserId(userId);

    if (!patient) {
      throw new NotFoundException('Patient does not exist');
    }

    const chatId = await this.isChatConversationExists(patient.id);

    if (!chatId) {
      throw new NotFoundException('Chat conversation does not exist');
    }

    const messages = await this.prismaService.assistantMessage.findMany({
      where: { assistantChatId: chatId },
      select: { role: true, content: true, sentAt: true, id: true },
    });

    const formattedMessages = messages.map(message => {
      return {
        ...message,
        doctors: [],
      };
    });

    return plainToInstance(ResponseAssistantChatMessageDto, formattedMessages);
  }

  async getMessageById(messageId: string): Promise<ResponseAssistantChatMessageDto> {
    const message = await this.prismaService.assistantMessage.findUnique({ where: { id: messageId } });

    return plainToInstance(ResponseAssistantChatMessageDto, message);
  }

  async createPrompt(text: string): Promise<ResponsePromptDto> {
    const prompt = await this.prismaService.prompt.create({ data: { text } });

    return plainToInstance(ResponsePromptDto, prompt);
  }

  async modifyPrompt(id: string, newPrompt: string): Promise<ResponsePromptDto> {
    const prompt = await this.prismaService.prompt.update({ where: { id }, data: { text: newPrompt } });

    if (!prompt) {
      throw new NotFoundException(`Prompt with id ${id} not found`);
    }

    return plainToInstance(ResponsePromptDto, prompt);
  }
}
