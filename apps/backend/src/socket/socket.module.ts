import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';
import * as RedisStore from 'cache-manager-redis-store';
import { CacheModuleRegister } from '../config/redis';

@Module({
  imports: [CacheModule.register(CacheModuleRegister(RedisStore)), AuthModule, UserModule, JwtModule],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
