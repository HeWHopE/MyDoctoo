import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
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
import { PatientService } from 'src/patient/patient.service';
import JWTGuard from '../auth/gaurds/jwt.guard';
import { UserDec } from '../user/user.decorator';
import { BadRequestResponse } from '../utils/BadRequestResponse';
import { ClassicNestResponse } from '../utils/ClassicNestResponse';
import { UnauthorizedResponse } from '../utils/UnauthorizedResponse';
import { RESPONSE_STATUS } from '../utils/constants';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create.dto';
import { GetDoctorsQuery } from './dto/get.query';
import { PatchDoctorDto } from './dto/patch.dto';
import { ResponseDoctorListDto } from './dto/response-list.dto';
import { ResponseDoctorDto } from './dto/response.dto';
import { Role } from '../auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/gaurds/role.guard';
import { DoctorScheduleService } from './doctor-schedule.service';
import { GetDoctorScheduleQuery } from './dto/get-schedule.query';
import { ResponseDoctorScheduleDto } from './dto/response-schedule.dto';

@ApiTags('Doctor Endpoints')
@Controller('doctor')
export class DoctorController {
  constructor(
    private readonly doctorService: DoctorService,
    private readonly doctorScheduleService: DoctorScheduleService,
    private readonly patientService: PatientService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create doctor' })
  @ApiOkResponse({ type: ResponseDoctorDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBody({ type: CreateDoctorDto })
  createDoctor(@Body() body: CreateDoctorDto) {
    return this.doctorService.createDoctor(body);
  }

  @UseGuards(JWTGuard)
  @Get()
  @ApiOperation({ summary: 'Get all doctors' })
  @ApiOkResponse({ type: ResponseDoctorListDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  async getDoctors(@UserDec() userInfo, @Query() query: GetDoctorsQuery) {
    const patient = await this.patientService.getPatientByUserId(userInfo.id);
    return this.doctorService.getDoctors(patient.id, query);
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Role('PATIENT')
  @Get('doctors/my')
  @ApiOperation({ summary: 'Get my doctors' })
  @ApiHeader({ name: 'Cookie', example: 'jwt=eyJhbGci...', description: 'JWT token' })
  @ApiOkResponse({ type: ResponseDoctorDto, isArray: true, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  async getMyDoctors(@UserDec() userInfo): Promise<ResponseDoctorDto[]> {
    const patient = await this.patientService.getPatientByUserId(userInfo.id);
    return await this.doctorService.getPatientDoctors(patient.id);
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Get('doctors/:id')
  @ApiOperation({ summary: 'Get all doctors by patient' })
  @ApiOkResponse({ type: ResponseDoctorDto, isArray: true, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique patient id.' })
  async getPatientDoctors(@Param('id') id: string): Promise<ResponseDoctorDto[]> {
    return await this.doctorService.getPatientDoctors(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get doctor' })
  @ApiOkResponse({ type: ResponseDoctorDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique doctor id.' })
  getDoctor(@Param('id') id: string) {
    return this.doctorService.getDoctor(id);
  }

  @Get(':id/schedule')
  @ApiOperation({ summary: "Get doctor's schedule" })
  @ApiOkResponse({ type: ResponseDoctorScheduleDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique doctor id.' })
  getDoctorSchedule(@Param('id') id: string, @Query() query: GetDoctorScheduleQuery) {
    return this.doctorScheduleService.getDoctorSchedule(id, query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update doctor' })
  @ApiOkResponse({ type: ResponseDoctorDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique doctor id.' })
  @ApiBody({ type: PatchDoctorDto })
  patchDoctor(@Param('id') id: string, @Body() body: PatchDoctorDto) {
    return this.doctorService.patchDoctor(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete doctor' })
  @ApiOkResponse({ description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique doctor id.' })
  deleteDoctor(@Param('id') id: string) {
    return this.doctorService.deleteDoctor(id);
  }
}
