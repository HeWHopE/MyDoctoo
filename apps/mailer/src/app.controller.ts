import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'SendPatientSignUpMail' })
  async sendPatientSignUpMail(body: { to: string; name: string; token: string }): Promise<void> {
    await this.appService.sendPatientSignUpMail(body);
  }

  @MessagePattern({ cmd: 'SendMFACode' })
  async sendMFACode(body: { to: string; name: string; code: string }): Promise<void> {
    await this.appService.sendMFACode(body);
  }

  @MessagePattern({ cmd: 'SendEmailChangeMail' })
  async sendEmailChangeMail(body: { to: string; oldEmail: string; name: string; token: string }): Promise<void> {
    await this.appService.sendEmailChangeMail(body);
  }
}
