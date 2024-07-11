import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from '@prisma/client';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseNotificationDto } from './dto/response.dto';
import { RESPONSE_STATUS } from '../utils/constants';
import { BadRequestResponse } from '../utils/BadRequestResponse';
import JWTGuard from '../auth/gaurds/jwt.guard';
import { RolesGuard } from '../auth/gaurds/role.guard';
import { PatientService } from '../patient/patient.service';
import { UserDec } from '../user/user.decorator';
import { Role } from '../auth/decorators/roles.decorator';

@ApiTags('Notification Endpoints')
@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly patientService: PatientService,
  ) {}

  @UseGuards(JWTGuard, RolesGuard)
  @Role('PATIENT')
  @Get('/my')
  @ApiOperation({ summary: 'Get all notification for patient' })
  @ApiOkResponse({ type: ResponseNotificationDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  async getMyNotifications(
    @UserDec() userInfo,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('filter') filter: 'all' | 'appointment' | 'payment' | 'message' = 'all',
  ): Promise<{ notifications: Notification[]; totalCount: number }> {
    const patient = await this.patientService.getPatientByUserId(userInfo.id);
    return await this.notificationService.getNotificationsForPatient(patient.id, page, limit, filter);
  }

  @Get(':patientId')
  @ApiOperation({ summary: 'Get all notification for patient' })
  @ApiOkResponse({ type: ResponseNotificationDto, description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.' })
  async getNotificationsForPatient(
    @Param('patientId') patientId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('filter') filter: 'all' | 'appointment' | 'payment' | 'message' = 'all',
  ): Promise<{ notifications: Notification[]; totalCount: number }> {
    return await this.notificationService.getNotificationsForPatient(patientId, page, limit, filter);
  }
}
