import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Cache } from 'cache-manager';
import { Server, Socket } from 'socket.io';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/strategies/jwt';
import { AuthRequestHelper } from 'src/auth/utils/cookie-helper.service';
import { ResponseUserDto } from '../user/dto/response.dto';

export type SocketPayload = { userId?: string; message: any };

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('SocketGateway');

  constructor(
    @Inject(CACHE_MANAGER) protected cacheManager: Cache,
    protected readonly jwtService: JwtService,
    protected readonly authService: AuthService,
    protected readonly userService: UserService,
  ) {}

  afterInit() {
    //server: any
  }

  //************************************** */

  // use redis to manage socket id across instances using uerId
  async addSocketId(userId: string, socketId: string): Promise<void> {
    try {
      const socketIds = await this.getSocketId(userId);

      if (socketIds && Array.isArray(socketIds) && socketIds.length) {
        socketIds.push(socketId);
        await this.cacheManager.set(`userId:${userId}`, [...new Set(socketIds)]);
      } else {
        await this.cacheManager.set(`userId:${userId}`, [socketId]);
      }
      await this.cacheManager.set(`socketId:${socketId}`, userId);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getSocketId(userId: string): Promise<string[] | null> {
    try {
      return this.cacheManager.get(`userId:${userId}`);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getUserId(socketId: string): Promise<string | null> {
    try {
      return this.cacheManager.get(`socketId:${socketId}`);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async removeUserId(socketId: string): Promise<string> {
    try {
      const userId = await this.getUserId(socketId);
      const socketIds = await this.getSocketId(userId);

      if (socketIds) {
        const updatedSocketIds = socketIds.filter(id => id !== socketId);

        if (updatedSocketIds.length > 0) {
          await this.cacheManager.set(`userId:${userId}`, updatedSocketIds);
        } else {
          await this.cacheManager.del(`userId:${userId}`);
        }
      }
      await this.cacheManager.del(`socketId:${socketId}`);

      return userId;
    } catch (error) {
      this.logger.error(error);
    }
  }

  //************************************** */

  // On User Connect
  async handleConnection(client: Socket) {
    try {
      const user = await this.getUserByClient(client);
      if (!user) {
        client.emit('connection', 'Unauthorized');
      } else {
        await this.addSocketId(user.id, client.id);
        const receiverSocketId = await this.getSocketId(user.id);
        if (receiverSocketId) this.server.to(receiverSocketId).emit('connected_instance');
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  // On User Disconnect
  async handleDisconnect(client: Socket) {
    try {
      await this.removeUserId(client.id);
    } catch (error) {
      this.logger.error(error);
    }
  }

  //************************************** */

  // send message to all clients
  sendMessageToAll(event: string, data: SocketPayload) {
    try {
      this.server.emit(event, data.message);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async sendMessageSpecificUser(userId: string, event: string, data: any) {
    const receiverSocketId = await this.getSocketId(userId);
    this.server.to(receiverSocketId).emit(event, data);
  }

  async sendMessageSpecificUsers(userIds: string[], event: string, data: any) {
    userIds.forEach(async userId => {
      const receiverSocketId = await this.getSocketId(userId);
      this.server.to(receiverSocketId).emit(event, data);
    });
  }

  // all messages sent from client side
  @SubscribeMessage('send_message')
  async handleMessage(@MessageBody() data: { userId: string; message: string }) {
    const receiverSocketId = await this.getSocketId(data.userId);
    this.server.to(receiverSocketId).emit('message', {
      message: data.message,
      instance: process.env.NODE_INSTANCE_ID,
    });
  }

  //************************************** */

  // get user from jwt token in cookie
  async getUserByClient(client: Socket): Promise<ResponseUserDto | null> {
    const headers = client.handshake.headers;

    let token: string | undefined = undefined;
    if (headers.cookie) {
      const cookies = headers.cookie.split(';');
      cookies.forEach(cookie => {
        const cookieProps = cookie.trim().split('=');
        if (cookieProps[0].trim() === AuthRequestHelper.JWT_COOKIE_NAME) {
          token = cookieProps[1].trim();
        }
      });
    }

    if (!token) return null;

    const isCloseToExpire = this.authService.jwtCloseToExpire(token);
    if (!isCloseToExpire) return null;

    const payload = this.jwtService.decode<JwtPayload & { exp: number }>(token);
    if (!payload || !payload.sub || !payload.exp) return null;

    const user: ResponseUserDto | null = await this.userService.getUser(payload.sub).catch(() => null);
    return user;
  }

  //************************************** */
}
