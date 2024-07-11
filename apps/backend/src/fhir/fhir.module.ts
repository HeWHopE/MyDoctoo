import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FhirController } from './fhir.controller';
import { FhirService } from './fhir.service';

@Module({
  controllers: [FhirController],
  imports: [HttpModule],
  providers: [FhirService],
})
export class FhirModule {}
