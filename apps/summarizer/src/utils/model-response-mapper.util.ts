import { TokenClassificationOutput } from '@huggingface/inference';
import { BodyPart, Complaint, Position, SummaryDto } from '../dto/summary.dto';

export function mapModelResponseToDto(response: TokenClassificationOutput) {
  const summary = new SummaryDto();
  for (const result of response) {
    if (result.entity_group === 'DISEASE_DISORDER' || result.entity_group === 'SIGN_SYMPTOM') {
      const complaint = new Complaint(result.word, new Position(result.start, result.end));
      summary.complaints.push(complaint);
    } else if (result.entity_group === 'BIOLOGICAL_STRUCTURE') {
      const bodyPart = new BodyPart(result.word, new Position(result.start, result.end));
      summary.problematicBodyParts.push(bodyPart);
    }
  }
  return summary;
}
