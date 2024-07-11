import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { BadRequestResponse } from 'src/utils/BadRequestResponse';
import { ClassicNestResponse } from 'src/utils/ClassicNestResponse';
import { RESPONSE_STATUS } from '../utils/constants';
import { AllergyService } from './allergy.service';
import { CreateAllergyDto } from './dto/create.dto';
import { ResponseAllergyDto } from './dto/response.dto';
import { UpdateAllergyDto } from './dto/update.dto';

@ApiTags('Allergy Endpoints')
@Controller('allergy')
export class AllergyController {
  constructor(private readonly allergyService: AllergyService) {}

  @Post()
  @ApiOperation({ summary: 'Create allergy' })
  @ApiOkResponse({ type: ResponseAllergyDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBody({ type: CreateAllergyDto })
  createAllergy(@Body() body: CreateAllergyDto) {
    return this.allergyService.createAllergy(body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all allergies' })
  @ApiOkResponse({ type: ResponseAllergyDto, isArray: true, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  getAllergies() {
    return this.allergyService.getAllergies();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get allergy' })
  @ApiOkResponse({ type: ResponseAllergyDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique allergy id.' })
  getAllergy(@Param('id') id: string) {
    return this.allergyService.getAllergy(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update allergy' })
  @ApiOkResponse({ type: ResponseAllergyDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique allergy id.' })
  @ApiBody({ type: UpdateAllergyDto })
  patchAllergy(@Param('id') id: string, @Body() body: UpdateAllergyDto) {
    return this.allergyService.patchAllergy(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete allergy' })
  @ApiOkResponse({ description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiNotFoundResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique allergy id.' })
  deleteAllergy(@Param('id') id: string) {
    return this.allergyService.deleteAllergy(id);
  }
}
