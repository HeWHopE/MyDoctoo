import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { SummaryDto } from './dto/summary.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'GenerateSummary' })
  generateSummary(body: { text: string }): Promise<SummaryDto> {
    return this.appService.generateSummary(body.text);
  }
}
