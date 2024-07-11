import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import JWTGuard from 'src/auth/gaurds/jwt.guard';
import { PatientService } from 'src/patient/patient.service';
import { UserDec } from 'src/user/user.decorator';
import { UnauthorizedResponse } from 'src/utils/UnauthorizedResponse';
import { BadRequestResponse } from '../utils/BadRequestResponse';
import { ClassicNestResponse } from '../utils/ClassicNestResponse';
import { RESPONSE_STATUS } from '../utils/constants';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create.dto';
import { PatchAppointmentDto } from './dto/patch.dto';
import { ResponseAppointmentDto } from './dto/response.dto';
import { DoctorService } from '../doctor/doctor.service';
import { RolesGuard } from '../auth/gaurds/role.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { UpdateAppointmentNotesDto } from './dto/update-appointment-notes.dto';
import { AppointmentNotesReponseDto } from './dto/appointment-notes-response.dto';

@ApiTags('Appointment Endpoints')
@Controller('appointment')
export class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly patientService: PatientService,
    private readonly doctorService: DoctorService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create an appointment' })
  @ApiOkResponse({ type: ResponseAppointmentDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBody({ type: CreateAppointmentDto })
  createAppointment(@Body() body: CreateAppointmentDto) {
    return this.appointmentService.createAppointment(body);
  }

  @UseGuards(JWTGuard)
  @Get('my')
  @ApiOperation({ summary: 'Get my appointment' })
  @ApiHeader({ name: 'Cookie', example: 'jwt=eyJhbGci...', description: 'JWT token' })
  @ApiOkResponse({ type: ResponseAppointmentDto, isArray: true, description: RESPONSE_STATUS.SUCCESS })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  async getMyAppointments(@UserDec() userInfo) {
    const result = await this.patientService.getPatientByUserId(userInfo.id);
    return this.appointmentService.getAppointmentsByPatientId(result.id);
  }

  @UseGuards(JWTGuard)
  @Get('my/range')
  @ApiOperation({ summary: 'Get my appointment in range' })
  @ApiHeader({ name: 'Cookie', example: 'jwt=eyJhbGci...', description: 'JWT token' })
  @ApiOkResponse({ type: ResponseAppointmentDto, isArray: true, description: RESPONSE_STATUS.SUCCESS })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse, description: RESPONSE_STATUS.ERROR })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiQuery({
    name: 'startDate',
    type: String,
    required: false,
    example: '2023-03-01T00:00:00.000Z',
    description: 'Start date for appointment filtering',
  })
  @ApiQuery({
    name: 'endDate',
    type: String,
    required: false,
    example: '2023-03-31T23:59:59.999Z',
    description: 'End date for appointment filtering',
  })
  async getMyRangeAppointments(@UserDec() userInfo, @Query() query) {
    const { startDate, endDate } = query;
    return this.appointmentService.getAppointmentsByUserId(userInfo.id, userInfo.role, startDate, endDate);
  }

  @Get()
  @ApiOperation({ summary: 'Get all appointments' })
  @ApiOkResponse({ type: ResponseAppointmentDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  getAppointments() {
    return this.appointmentService.getAppointments();
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Role('DOCTOR')
  @Get('doctor/all')
  @ApiOperation({ summary: 'Get all doctors appointments' })
  @ApiOkResponse({ type: ResponseAppointmentDto, isArray: true, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse, description: RESPONSE_STATUS.ERROR })
  @ApiHeader({ name: 'Cookie', example: 'jwt=eyJhbGci...', description: 'JWT token' })
  async getAllDoctorsAppointments(@UserDec() userInfo) {
    const loginedDoctor = await this.doctorService.getDoctorByUserId(userInfo.id);
    return await this.appointmentService.getAppointmentsByDoctorId(loginedDoctor.id);
  }

  @Get('patient/:id')
  @ApiOperation({ summary: 'Get all appointments by patient id' })
  @ApiOkResponse({ type: ResponseAppointmentDto, isArray: true, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique patient id.' })
  getAppointmentsByPatientId(@Param('id') id: string) {
    return this.appointmentService.getAppointmentsByPatientId(id);
  }

  @Get('doctor/:id')
  @ApiOperation({ summary: 'Get all appointments by doctor id' })
  @ApiOkResponse({ type: ResponseAppointmentDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique doctor id.' })
  getAppointmentsByDoctorId(@Param('id') id: string) {
    return this.appointmentService.getAppointmentsByDoctorId(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an appointment' })
  @ApiOkResponse({ type: ResponseAppointmentDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique appointment id.' })
  getAppointment(@Param('id') id: string) {
    return this.appointmentService.getAppointment(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an appointment' })
  @ApiOkResponse({ type: ResponseAppointmentDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique appointment id.' })
  @ApiBody({ type: PatchAppointmentDto })
  patchAppointment(@Param('id') id: string, @Body() body: PatchAppointmentDto) {
    return this.appointmentService.patchAppointment(id, body);
  }

  @UseGuards(JWTGuard)
  @Patch(':id/notes')
  @ApiOperation({ summary: "Update the appointment's notes " })
  @ApiOkResponse({ type: AppointmentNotesReponseDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique appointment id.' })
  @ApiBody({ type: UpdateAppointmentNotesDto })
  async updateNotes(@Param('id') id: string, @Body() body: UpdateAppointmentNotesDto, @UserDec() userInfo) {
    return this.appointmentService.updateNotes(userInfo.id, id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an appointment' })
  @ApiOkResponse({ description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'id', example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique appointment id.' })
  deleteAppointment(@Param('id') id: string) {
    return this.appointmentService.deleteAppointment(id);
  }
}
