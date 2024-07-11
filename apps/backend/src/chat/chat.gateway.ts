import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { forwardRef, Inject } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Cache } from 'cache-manager';
import { Server } from 'socket.io';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { ResponseChatDto } from './dto/response.dto';
import { ResponseMessageDto } from './dto/responseMessage.dto';
import { SocketGateway } from '../socket/socket.gateway';

export type SocketPayload = { userId?: string; message: any };

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class ChatGateway extends SocketGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => ChatService)) protected chatService: ChatService,
    @Inject(CACHE_MANAGER) protected cacheManager: Cache,
    protected readonly jwtService: JwtService,
    protected readonly authService: AuthService,
    protected readonly userService: UserService,
  ) {
    super(cacheManager, jwtService, authService, userService);
  }

  afterInit() {
    this.chatService.eventEmitter.on('chat.created', (response: ResponseChatDto) => {
      this.handleEvent(response.id, 'chat.created', response);
    });
    this.chatService.eventEmitter.on('chat.message.create', (response: ResponseMessageDto) => {
      this.handleEvent(response.chatId, `chat.${response.chatId}.add-message`, response);
    });
    this.chatService.eventEmitter.on('chat.message.update', (response: ResponseMessageDto) => {
      this.handleEvent(response.chatId, `chat.${response.chatId}.update-message`, response);
    });
    this.chatService.eventEmitter.on('chat.read-messages', response => {
      this.handleEvent(response.chatId, `chat.${response.chatId}.read-messages`, response);
    });
  }

  async handleEvent(chatId: string, event: string, payload: any) {
    const userIds = await this.chatService.getUserIdsByChatId(chatId);
    userIds.forEach(async userId => {
      const receiverSocketId = await this.getSocketId(userId);
      this.server.to(receiverSocketId).emit(event, payload);
    });
  }
}
