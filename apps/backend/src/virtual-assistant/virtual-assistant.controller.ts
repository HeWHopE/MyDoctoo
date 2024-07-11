import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { VirtualAssistantService } from './virtual-assistant.service';
import { CreateMessageDto } from './dto/createMesasge.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseAssistantChatMessageDto } from './dto/response.dto';
import { RESPONSE_STATUS } from 'src/utils/constants';
import { BadRequestResponse } from 'src/utils/BadRequestResponse';
import { ClassicNestResponse } from 'src/utils/ClassicNestResponse';
import { CreatePromptDto } from './dto/createPrompt.dto';
import { ResponsePromptDto } from './dto/responsePrompt.dto';
import JWTGuard from 'src/auth/gaurds/jwt.guard';
import { User } from '@prisma/client';

@ApiTags('Virtual Assistant Endpoints')
@Controller('virtual-assistant')
export class VirtualAssistantController {
  constructor(private readonly virtualAssistantService: VirtualAssistantService) {}

  @UseGuards(JWTGuard)
  @ApiHeader({ name: 'Cookie', example: 'jwt=eyJhbGci...', description: 'JWT token' })
  @ApiOperation({ summary: 'Initialize conversation' })
  @ApiOkResponse({ type: ResponseAssistantChatMessageDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @Get('initialize-conversation')
  async initConversation(@Req() req: Request) {
    const user: User = req['user'];
    return this.virtualAssistantService.initializeConversation(user.id);
  }

  // Should be called only after major changes in the assistant, then .env should be changed to match new assistant id.
  // @Get('init/:promptId')
  // @ApiOperation({ summary: 'Initialize new assistant' })
  // @ApiParam({ name: 'promptId', example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique prompt id.' })
  // @ApiOkResponse({ description: RESPONSE_STATUS.SUCCESS })
  // @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  // @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  // async init(@Param('promptId') promptId: string) {
  //   return this.virtualAssistantService.initializeVirtualAssistant(promptId);
  // }

  @ApiOperation({ summary: 'Create a message and get an AI response' })
  @ApiParam({ name: 'patientId', example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique patient id.' })
  @ApiBody({ type: CreateMessageDto })
  @ApiOkResponse({ type: ResponseAssistantChatMessageDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @Post('create-message/:patientId')
  async createMessage(@Param('patientId') patientId: string, @Body() body: CreateMessageDto) {
    return this.virtualAssistantService.createMessage({ patientId, content: body.content });
  }

  @UseGuards(JWTGuard)
  @ApiHeader({ name: 'Cookie', example: 'jwt=eyJhbGci...', description: 'JWT token' })
  @ApiOperation({ summary: 'Get all messages from patient' })
  @ApiOkResponse({ type: ResponseAssistantChatMessageDto, isArray: true, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @Get('get-messages')
  async getMessages(@Req() req: Request) {
    const user: User = req['user'];
    return this.virtualAssistantService.getChatMessages(user.id);
  }

  @ApiOperation({ summary: 'Get message by id' })
  @ApiParam({ name: 'messageId', example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique message id.' })
  @ApiOkResponse({ type: ResponseAssistantChatMessageDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @Get('get-message/:messageId')
  async getMessageById(@Param('messageId') messageId: string) {
    return this.virtualAssistantService.getChatMessages(messageId);
  }

  @Post('prompt')
  @ApiOkResponse({ type: ResponsePromptDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBody({ type: CreatePromptDto, description: 'The text of the prompt' })
  async createPrompt(@Body() body: CreatePromptDto) {
    return this.virtualAssistantService.createPrompt(body.text);
  }

  @Patch('prompt/:id')
  @ApiOkResponse({ type: ResponsePromptDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBody({ type: CreatePromptDto, description: 'The text of the prompt' })
  async patchPrompt(@Param('id') id: string, @Body() body: CreatePromptDto) {
    return this.virtualAssistantService.modifyPrompt(id, body.text);
  }
}
