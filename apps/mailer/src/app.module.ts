import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import rabbitmq from './config/rabbitmq';
import mail from './config/mail';
import config from './config/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [rabbitmq, mail, config], // Load all necessary configurations
    }),
    MailerModule.forRootAsync({
      useFactory: async (mailConfig: ConfigType<typeof mail>) => ({
        transport: {
          host: mailConfig.MAIL_HOST,
          port: mailConfig.MAIL_PORT,
          secure: mailConfig.MAIL_SECURE,
          auth: {
            user: mailConfig.MAIL_USER,
            pass: mailConfig.MAIL_PASS,
          },
        },
        defaults: {
          from: {
            address: mailConfig.MAIL_FROM,
            name: 'No Reply',
          },
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: { strict: true },
        },
      }),
      inject: [mail.KEY],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
