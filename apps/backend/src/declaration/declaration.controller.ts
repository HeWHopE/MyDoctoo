import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import JWTGuard from '../auth/gaurds/jwt.guard';
import { PatientService } from '../patient/patient.service';
import { UserDec } from '../user/user.decorator';
import { BadRequestResponse } from '../utils/BadRequestResponse';
import { ClassicNestResponse } from '../utils/ClassicNestResponse';
import { UnauthorizedResponse } from '../utils/UnauthorizedResponse';
import { RESPONSE_STATUS } from '../utils/constants';
import { DeclarationService } from './declaration.service';
import { CreateDeclarationDto } from './dto/create.dto';
import { ResponseDeclarationDto } from './dto/response.dto';
import { UpdateDeclarationDto } from './dto/update.dto';

@ApiTags('Declaration Endpoints')
@Controller('declaration')
export class DeclarationController {
  constructor(
    private readonly declarationService: DeclarationService,
    private readonly patientService: PatientService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create declaration' })
  @ApiOkResponse({ type: ResponseDeclarationDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBody({ type: CreateDeclarationDto })
  createDeclaration(@Body() body: CreateDeclarationDto) {
    return this.declarationService.createDeclaration(body);
  }

  @UseGuards(JWTGuard)
  @Get('my')
  @ApiOperation({ summary: 'Get my appointment' })
  @ApiHeader({ name: 'Cookie', example: 'jwt=eyJhbGci...', description: 'JWT token' })
  @ApiOkResponse({ type: ResponseDeclarationDto, isArray: true, description: RESPONSE_STATUS.SUCCESS })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  async getMyAppointments(@UserDec() userInfo) {
    const result = await this.patientService.getPatientByUserId(userInfo.id);
    return this.declarationService.getDeclarationByPatientId(result.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get declaration' })
  @ApiOkResponse({ type: ResponseDeclarationDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'id', example: '1', description: 'Unique declaration id.' })
  getDeclaration(@Param('id') id: string) {
    return this.declarationService.getDeclaration(+id);
  }

  @Get()
  @ApiOperation({ summary: 'Get declarations' })
  @ApiOkResponse({ type: ResponseDeclarationDto, isArray: true, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  getDeclarations() {
    return this.declarationService.getDeclarations();
  }

  @Get('patient/:id')
  @ApiOperation({ summary: 'Get declaration by patient id' })
  @ApiOkResponse({ type: ResponseDeclarationDto, isArray: true, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'id', example: '154c3773-5130-4970-8a94-ded9a01cd0ec', description: 'Unique patient id.' })
  getDeclarationByPatientId(@Param('id') id: string) {
    return this.declarationService.getDeclarationByPatientId(id);
  }

  @Get('doctor/:id')
  @ApiOperation({ summary: 'Get declaration by doctor id' })
  @ApiOkResponse({ type: ResponseDeclarationDto, isArray: true, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'id', example: '154c3773-5130-4970-8a94-ded9a01cd0ec', description: 'Unique doctor id.' })
  getDeclarationByDoctorId(@Param('id') id: string) {
    return this.declarationService.getDeclarationByDoctorId(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update declaration' })
  @ApiOkResponse({ type: ResponseDeclarationDto, isArray: true, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'id', example: '1', description: 'Unique declaration id.' })
  @ApiBody({ type: CreateDeclarationDto })
  patchDeclaration(@Param('id') id: string, @Body() body: UpdateDeclarationDto) {
    return this.declarationService.patchDeclaration(+id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete declaration' })
  @ApiOkResponse({ description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'id', example: '1', description: 'Unique declaration id.' })
  deleteDeclaration(@Param('id') id: string) {
    return this.declarationService.deleteDeclaration(+id);
  }
}
