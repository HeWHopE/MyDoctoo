import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import JWTGuard from '../auth/gaurds/jwt.guard';
import { PatientService } from '../patient/patient.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ResponseChatArrayDto, ResponseChatDto } from './dto/response.dto';
import { ClassicNestResponse } from '../utils/ClassicNestResponse';
import { BadRequestResponse } from '../utils/BadRequestResponse';
import { RESPONSE_STATUS } from '../utils/constants';
import { UnauthorizedResponse } from '../utils/UnauthorizedResponse';
import { ResponseMessageArrayDto, ResponseMessageDto } from './dto/responseMessage.dto';
import { Role, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChatDto, CreateMessageDto } from './dto/create.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ResponseAttachmentArrayDto } from './dto/responseMessageAttachment.dto';
import { ResponseSearchedChatsDto } from './dto/responseSearchedChats';

@ApiTags('Chat Endpoints')
@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly patientService: PatientService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create chat',
    description: 'This endpoint created a chat',
  })
  @ApiHeader({ name: 'Cookie', example: 'jwt=eyJhbGci...', description: 'JWT token' })
  @ApiCreatedResponse({ type: ResponseChatDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBody({ type: CreateChatDto })
  @UseGuards(JWTGuard)
  async createChat(@Req() req: Request, @Body() createChatDto: CreateChatDto) {
    const user: User = req['user'];
    const participantId = createChatDto.participantId;

    const patient = await this.patientService.getPatientByUserId(user.role === Role.PATIENT ? user.id : participantId);
    const doctor = await this.prismaService.doctor.findFirst({
      where: { userId: user.role === Role.DOCTOR ? user.id : participantId },
    });

    return this.chatService.createChat({ patientId: patient.id, doctorId: doctor.id, role: user.role });
  }

  @Get()
  @ApiOperation({
    summary: 'Get a chat list',
    description: 'This endpoint retrieves a chat list.',
  })
  @ApiHeader({ name: 'Cookie', example: 'jwt=eyJhbGci...', description: 'JWT token' })
  @ApiOkResponse({ type: ResponseChatArrayDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiQuery({ name: 'skip', required: false, type: Number, description: 'Number of chats to skip.' })
  @ApiQuery({ name: 'take', required: false, type: Number, description: 'Number of chats to take.' })
  @UseGuards(JWTGuard)
  async getChats(@Req() req: Request, @Query('skip') skipQuery: string, @Query('take') takeQuery: string) {
    const skip = skipQuery ? Number(skipQuery) : undefined;
    const take = takeQuery ? Number(takeQuery) : undefined;

    // TODO: Add better validation.
    if (skipQuery && isNaN(skip)) {
      throw new BadRequestException('Skip query parameter must be a number.');
    }

    if (takeQuery && isNaN(take)) {
      throw new BadRequestException('Take query parameter must be a number.');
    }

    const user: User = req['user'];
    return this.chatService.getChatsByUserId(user.id, user.role, skip, take);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search Chats',
    description: 'Search for chats by messages or participant names.',
  })
  @ApiHeader({ name: 'Cookie', example: 'jwt=eyJhbGci...', description: 'JWT token' })
  @ApiOkResponse({ type: ResponseSearchedChatsDto, description: 'Successful chat search.' })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse, description: 'Unauthorized access.' })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: 'Internal server error.' })
  @ApiQuery({ name: 'q', required: true, type: String, description: 'Search text' })
  @UseGuards(JWTGuard)
  async searchChats(@Req() req: Request, @Query('q') q: string) {
    if (q === '') {
      throw new BadRequestException('Search text is empty');
    }
    const user: User = req['user'];
    return this.chatService.searchChat(user.id, user.role, q);
  }

  @Get('/:chatId')
  @ApiOperation({
    summary: 'Get a chat',
    description: 'This endpoint retrieves a chat.',
  })
  @ApiHeader({ name: 'Cookie', example: 'jwt=eyJhbGci...', description: 'JWT token' })
  @ApiOkResponse({ type: ResponseChatDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'chatId', example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique chat id.' })
  @UseGuards(JWTGuard)
  async getChat(@Req() req: Request, @Param('chatId') chatId: string) {
    const user: User = req['user'];
    return this.chatService.getChatByIdAndUserId(chatId, user.id, user.role);
  }

  @Patch('/:chatId/read-messages')
  @ApiOperation({
    summary: 'Read messages (set count missed messages to 0)',
    description: 'This endpoint for read message (set count missed messages to 0).',
  })
  @ApiHeader({ name: 'Cookie', example: 'jwt=eyJhbGci...', description: 'JWT token' })
  @ApiOkResponse({ type: Number, description: RESPONSE_STATUS.SUCCESS })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'chatId', example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique chat id.' })
  @UseGuards(JWTGuard)
  async readMessages(@Req() req: Request, @Param('chatId') chatId: string) {
    const user: User = req['user'];
    return this.chatService.readMessagesByUser(chatId, user.role);
  }

  @Get('/:chatId/messages')
  @ApiOperation({
    summary: 'Get chat messages',
    description: 'This endpoint retrieves chat messages.',
  })
  @ApiHeader({ name: 'Cookie', example: 'jwt=eyJhbGci...', description: 'JWT token' })
  @ApiOkResponse({ type: ResponseMessageArrayDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'chatId', example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique chat id.' })
  @ApiQuery({ name: 'skip', required: false, type: Number, description: 'Number of messages to skip.' })
  @ApiQuery({ name: 'take', required: false, type: Number, description: 'Number of messages to take.' })
  async getChatMessages(
    @Param('chatId') chatId: string,
    @Query('skip') skipQuery: string,
    @Query('take') takeQuery: string,
  ) {
    const skip = skipQuery ? Number(skipQuery) : undefined;
    const take = takeQuery ? Number(takeQuery) : undefined;

    // TODO: Add better validation.
    if (skipQuery && isNaN(skip)) {
      throw new BadRequestException('Skip query parameter must be a number.');
    }

    if (takeQuery && isNaN(take)) {
      throw new BadRequestException('Take query parameter must be a number.');
    }

    return this.chatService.getChatMessages(chatId, skip, take);
  }

  @Post('/:chatId/messages')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JWTGuard)
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({
    summary: 'create a message with uploading files',
    description: 'This endpoint creates a message in a chat.',
  })
  @ApiParam({ name: 'chatId', example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique chat id.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateMessageDto })
  @ApiCreatedResponse({ type: ResponseMessageDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  createMessage(
    @Req() req: Request,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() bodyData: { text: string; sentAt?: Date },
    @Param('chatId') chatId: string,
  ) {
    const user: User = req['user'];
    return this.chatService.createMessage({
      chatId,
      sender: user.role,
      text: bodyData.text,
      sentAt: bodyData.sentAt,
      files,
    });
  }

  @Get('/:chatId/attachments')
  @ApiOperation({
    summary: 'Get attachments by chatId',
    description: 'This endpoint retrieves attachments for a specific chat.',
  })
  @ApiHeader({ name: 'Cookie', example: 'jwt=eyJhbGci...', description: 'JWT token' })
  @ApiOkResponse({ type: ResponseAttachmentArrayDto, description: 'Attachments retrieved successfully' })
  @ApiParam({ name: 'chatId', example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique chat id.' })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiQuery({ name: 'skip', required: false, type: Number, description: 'Number of attachments to skip.' })
  @ApiQuery({ name: 'take', required: false, type: Number, description: 'Number of attachments to take.' })
  @UseGuards(JWTGuard)
  async getAttachmentsByChatId(
    @Param('chatId') chatId: string,
    @Query('skip') skipQuery: string,
    @Query('take') takeQuery: string,
  ) {
    const skip = skipQuery ? Number(skipQuery) : undefined;
    const take = takeQuery ? Number(takeQuery) : undefined;

    // TODO: Add better validation.
    if (skipQuery && isNaN(skip)) {
      throw new BadRequestException('Skip query parameter must be a number.');
    }

    if (takeQuery && isNaN(take)) {
      throw new BadRequestException('Take query parameter must be a number.');
    }
    const attachments = await this.chatService.getAttachmentsByChatId(chatId, skip, take);
    return attachments;
  }
}
