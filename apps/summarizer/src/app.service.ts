import { HfInference } from '@huggingface/inference';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { SummaryDto } from './dto/summary.dto';
import huggingface from './config/huggingface';
import { mapModelResponseToDto } from './utils/model-response-mapper.util';

@Injectable()
export class AppService {
  readonly hf: HfInference;
  constructor(@Inject(huggingface.KEY) private readonly hfConfig: ConfigType<typeof huggingface>) {
    this.hf = new HfInference(hfConfig.HF_TOKEN);
  }

  async generateSummary(text: string): Promise<SummaryDto> {
    const response = await this.hf.tokenClassification({
      inputs: text,
      model: this.hfConfig.HF_MODEL_NAME,
    });
    return mapModelResponseToDto(response);
  }
}
