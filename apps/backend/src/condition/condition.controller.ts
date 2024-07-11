import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConditionService } from './condition.service';
import { CreateConditionDto } from './dto/create.dto';
import { UpdateConditionDto } from './dto/update.dto';
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
import { ResponseCondtionDto } from './dto/response.dto';
import { ClassicNestResponse } from 'src/utils/ClassicNestResponse';
import { BadRequestResponse } from 'src/utils/BadRequestResponse';

@ApiTags('Condition Endpoints')
@Controller('condition')
export class ConditionController {
  constructor(private readonly conditionService: ConditionService) {}

  @ApiOperation({ summary: 'Create a new condition', description: 'This endpoint creates a new condition.' })
  @ApiBody({ type: CreateConditionDto })
  @ApiOkResponse({ type: ResponseCondtionDto, description: 'Condition created' })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: 'Bad request' })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: 'Internal server error' })
  @Post()
  create(@Body() body: CreateConditionDto) {
    return this.conditionService.createCondition(body);
  }

  @ApiOperation({ summary: 'Get all conditions', description: 'This endpoint retrieves all conditions.' })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: 'Bad request' })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: 'Internal server error' })
  @ApiOkResponse({ type: ResponseCondtionDto, isArray: true, description: 'Return conditions list' })
  @Get()
  findAll() {
    return this.conditionService.findAllConditions();
  }

  @ApiOperation({ summary: 'Get a condition by ID', description: 'This endpoint retrieves a condition object by ID.' })
  @ApiParam({ name: 'id', description: 'Condition ID', example: 'acde070d-8c4c-4f0d-9d8a-162843c10333' })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: 'Bad request' })
  @ApiOkResponse({ type: ResponseCondtionDto, description: 'Return condition by id' })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: 'Internal server error' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conditionService.findCondition(id);
  }

  @ApiOperation({ summary: 'Update a condition by ID', description: 'This endpoint updates a condition object by ID.' })
  @ApiBody({ type: UpdateConditionDto })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: 'Bad request' })
  @ApiOkResponse({ type: ResponseCondtionDto, description: 'Condition updated' })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: 'Internal server error' })
  @ApiParam({ name: 'id', description: 'Condition id', example: 'acde070d-8c4c-4f0d-9d8a-162843c10333' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateConditionDto) {
    return this.conditionService.updateCondition(id, body);
  }

  @ApiOperation({ summary: 'Delete a condition by ID', description: 'This endpoint deletes a condition object by ID.' })
  @ApiOkResponse({ type: ResponseCondtionDto, description: 'Condition deleted' })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: 'Internal server error' })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: 'Bad request' })
  @ApiNotFoundResponse({ type: ClassicNestResponse, description: 'Condition not found' })
  @ApiParam({ name: 'id', description: 'Condition id', example: '1' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conditionService.removeCondition(id);
  }
}
