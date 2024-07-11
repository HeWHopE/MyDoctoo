import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import config from './config/config';

@Injectable()
export class AppService {
  constructor(
    private readonly mailerService: MailerService,
    @Inject(config.KEY)
    private readonly configObject: ConfigType<typeof config>,
  ) {}

  async sendPatientSignUpMail(body: { to: string; name: string; token: string }): Promise<void> {
    await this.mailerService.sendMail({
      to: body.to,
      subject: `Welcome to the ${this.configObject.APP_NAME}!`,
      template: './patient-signup',
      context: {
        name: body.name,
        url: `${this.configObject.FRONTEND_URL}/${this.configObject.FRONTEND_SIGNUP_PATH}?token=${body.token}`,
      },
    });
  }

  async sendMFACode(body: { to: string; name: string; code: string }): Promise<void> {
    await this.mailerService.sendMail({
      to: body.to,
      subject: 'Verification code for two-factor authentication',
      template: './mfa-code',
      context: { name: body.name, code: body.code },
    });
  }

  async sendEmailChangeMail(body: { to: string; oldEmail: string; name: string; token: string }): Promise<void> {
    await this.mailerService.sendMail({
      to: body.to,
      subject: 'Change email',
      template: './change-email',
      context: {
        name: body.name,
        oldEmail: body.oldEmail,
        url: `${this.configObject.FRONTEND_URL}/${this.configObject.FRONTEND_CHANGE_EMAIL_PATH}?token=${body.token}`,
      },
    });
  }
}
