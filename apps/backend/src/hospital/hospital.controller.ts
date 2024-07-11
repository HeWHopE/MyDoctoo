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
import { ClassicNestResponse } from '../utils/ClassicNestResponse';
import { RESPONSE_STATUS } from '../utils/constants';
import { CreateHospitalDto } from './dto/create.dto';
import { PatchHospitalDto } from './dto/patch.dto';
import { ResponseHospitalDto } from './dto/response.dto';
import { HospitalService } from './hospital.service';

@ApiTags('Hospital Endpoints')
@Controller('hospital')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @Post()
  @ApiOperation({ summary: 'Create hospital' })
  @ApiOkResponse({ type: ResponseHospitalDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBody({ type: CreateHospitalDto })
  createHospital(@Body() body: CreateHospitalDto) {
    return this.hospitalService.createHospital(body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all hospitals' })
  @ApiOkResponse({ type: ResponseHospitalDto, isArray: true, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  getHospitals() {
    return this.hospitalService.getHospitals();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get hospital' })
  @ApiOkResponse({ type: ResponseHospitalDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000', description: "The hospital's unique id." })
  getHospital(@Param('id') id: string) {
    return this.hospitalService.getHospital(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update hospital' })
  @ApiOkResponse({ type: ResponseHospitalDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000', description: "The hospital's unique id." })
  @ApiBody({ type: PatchHospitalDto })
  patchHospital(@Param('id') id: string, @Body() body: PatchHospitalDto) {
    return this.hospitalService.patchHospital(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete hospital' })
  @ApiOkResponse({ description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000', description: "The hospital's unique id." })
  deleteHospital(@Param('id') id: string) {
    return this.hospitalService.deleteHospital(id);
  }
}
