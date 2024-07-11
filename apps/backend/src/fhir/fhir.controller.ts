import { Body, Controller, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { BadRequestResponse } from '../utils/BadRequestResponse';
import { ClassicNestResponse } from '../utils/ClassicNestResponse';
import { RESPONSE_STATUS } from '../utils/constants';
import { CreateFhirDto } from './dto/create-fhir.dto';
import { FhirService } from './fhir.service';

@ApiTags('Fhir Endpoints')
@Controller('fhir')
@ApiTags('FHIR') // Group all routes under the 'FHIR' tag in Swagger UI
export class FhirController {
  constructor(private readonly fhirService: FhirService) {}

  @Post('patient/:patientId')
  @ApiOperation({ summary: 'Fetch patient data from FHIR.' })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'patientId', example: '9b500d16-b81f-4d4f-9dd0-6a8afec98a8a', description: 'Unique patient id.' })
  fetchPatient(@Param('patientId') patientId: string, @Body() body: CreateFhirDto) {
    return this.fhirService.fetchPatient(patientId, body);
  }

  @Post('observation/:patientId')
  @ApiOperation({ summary: 'Fetch observation data from FHIR.' })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'patientId', example: '9b500d16-b81f-4d4f-9dd0-6a8afec98a8a', description: 'Unique patient id.' })
  fetchObservation(@Param('patientId') patientId: string, @Body() body: CreateFhirDto) {
    return this.fhirService.fetchObservation(patientId, body);
  }
}
