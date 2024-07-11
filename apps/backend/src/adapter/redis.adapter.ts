import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { configuration } from 'src/config/redis';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  pubClient: ReturnType<typeof createClient>;
  subClient: ReturnType<typeof createClient>;

  async connectToRedis(): Promise<void> {
    this.pubClient = createClient({
      password: configuration.REDIS_PASSWORD,
      socket: {
        host: configuration.REDIS_HOST,
        port: configuration.REDIS_PORT,
      },
    });
    this.subClient = this.pubClient.duplicate();

    await Promise.all([this.pubClient.connect(), this.subClient.connect()]);

    this.adapterConstructor = createAdapter(this.pubClient, this.subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
