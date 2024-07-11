import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { BadRequestResponse } from '../utils/BadRequestResponse';
import { RESPONSE_STATUS } from '../utils/constants';
import { CreateSpecializationDto } from './dto/create.dto';
import { ResponseSpecializationDto } from './dto/response.dto';
import { UpdateSpecializationDto } from './dto/update.dto';
import { SpecializationService } from './specialization.service';

@ApiTags('Specialization Endpoints')
@Controller('specialization')
export class SpecializationController {
  constructor(private readonly specializationService: SpecializationService) {}

  @Post()
  @ApiOperation({ summary: 'Create specialization' })
  @ApiOkResponse({ type: ResponseSpecializationDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBody({ type: CreateSpecializationDto })
  createSpecialization(@Body() body: CreateSpecializationDto) {
    return this.specializationService.createSpecialization(body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all specializations' })
  @ApiOkResponse({ type: ResponseSpecializationDto, isArray: true, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  getSpecializations() {
    return this.specializationService.getSpecializations();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specialization' })
  @ApiOkResponse({ type: ResponseSpecializationDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique specialisation id.' })
  getSpecialization(@Param('id') id: string) {
    return this.specializationService.getSpecialization(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update specialization' })
  @ApiOkResponse({ type: ResponseSpecializationDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique specialisation id.' })
  @ApiBody({ type: UpdateSpecializationDto })
  patchSpecialization(@Param('id') id: string, @Body() body: UpdateSpecializationDto) {
    return this.specializationService.patchSpecialization(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete specialization' })
  @ApiOkResponse({ description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique specialisation id.' })
  deleteSpecialization(@Param('id') id: string) {
    return this.specializationService.deleteSpecialization(id);
  }
}
