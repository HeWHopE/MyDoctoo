import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { BadRequestException, Inject } from '@nestjs/common';
import { Role } from '@prisma/client';
import { ResponseDoctorDto } from '../doctor/dto/response.dto';
import { ResponsePatientDto } from '../patient/dto/response.dto';
import { SocketGateway } from 'src/socket/socket.gateway';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { AppointmentService } from 'src/appointment/appointment.service';
import { ResponseUserDto } from 'src/user/dto/response.dto';
import { DoctorService } from 'src/doctor/doctor.service';
import { PatientService } from 'src/patient/patient.service';
import { ResponseAppointmentDto } from 'src/appointment/dto/response.dto';

type UserCombined = { role: Role; data: ResponseDoctorDto | ResponsePatientDto };

@WebSocketGateway({ cors: { origin: '*', credentials: true }, namespace: 'video' })
export class VideoSignalingGateway extends SocketGateway {
  constructor(
    @Inject(CACHE_MANAGER) cacheManager: Cache,
    jwtService: JwtService,
    authService: AuthService,
    userService: UserService,
    private readonly appointmentService: AppointmentService,
    private readonly doctorService: DoctorService,
    private readonly patientService: PatientService,
  ) {
    super(cacheManager, jwtService, authService, userService);
  }

  @SubscribeMessage('join')
  async join(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: { conferenceId: string },
  ): Promise<{ members: UserCombined[]; error?: string }> {
    const user = await this.getUserByClient(socket);
    if (!user) return null;
    const appointment: ResponseAppointmentDto = await this.appointmentService
      .getAppointment(payload.conferenceId)
      .catch(() => null);
    if (!appointment) return { members: [], error: 'Appointment not found' };
    if (user.id !== appointment.doctor.userId && user.id !== appointment.patient.userId)
      return { members: [], error: `${user.firstName} ${user.lastName} not allowed to be in this conference` };
    if (appointment.status !== 'PLANNED') return { members: [], error: 'Appointment is not planned' };

    this.addSocketId(user.id, socket.id);
    const isJoined = await this.isUserJoined(payload.conferenceId, user.id);
    if (isJoined) return { members: [], error: 'User already joined' };
    this.setUserJoined(payload.conferenceId, user.id);

    const anotherUser = await this.getAnotherUser(payload.conferenceId, user);
    const isAnotherJoined = await this.isUserJoined(payload.conferenceId, anotherUser.data.userId);
    if (!isAnotherJoined) return { members: [] };

    const userFull = await this.getFullUser(user.role, user.id);
    this.sendMessageSpecificUser(anotherUser.data.userId, 'member_joined', { user: userFull });

    return { members: [anotherUser] };
  }

  @SubscribeMessage('leave')
  async onLeave(@ConnectedSocket() socket: Socket, @MessageBody() payload: { conferenceId: string }) {
    const user = await this.getUserIfJoined(socket, payload.conferenceId);

    const anotherUser = await this.getAnotherUser(payload.conferenceId, user);
    if (anotherUser) this.sendMessageSpecificUser(anotherUser.data.userId, 'member_left', { userId: user.id });

    this.removeUserId(user.id);
    this.removeUserJoined(user.id);
  }

  @SubscribeMessage('new_offer')
  async onOffer(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: { memberId: string; offer: string; conferenceId: string },
  ) {
    const user = await this.getUserIfJoined(socket, payload.conferenceId);

    this.sendMessageSpecificUser(payload.memberId, 'new_offer', {
      userId: user.id,
      offer: payload.offer,
    });
  }

  @SubscribeMessage('video_state')
  async onVideoStateChange(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: { conferenceId: string; isVideoOn: boolean },
  ) {
    const user = await this.getUserIfJoined(socket, payload.conferenceId);
    const anotherUser = await this.getAnotherUser(payload.conferenceId, user);

    this.sendMessageSpecificUser(anotherUser.data.userId, 'video_state', {
      isVideoOn: payload.isVideoOn,
    });
  }

  @SubscribeMessage('new_answer')
  async onAnswer(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: { conferenceId: string; answer: string; memberId: string },
  ) {
    const user = await this.getUserIfJoined(socket, payload.conferenceId);

    const anotherUser = await this.getAnotherUser(payload.conferenceId, user);
    if (anotherUser)
      this.sendMessageSpecificUser(anotherUser.data.userId, 'answer_response', { answer: payload.answer });
  }

  @SubscribeMessage('ice_candidate')
  async onCandidate(@MessageBody() payload: { conferenceId: string; candidate: string; memberId: string }) {
    this.sendMessageSpecificUser(payload.memberId, 'new_ice_candidate', { candidate: payload.candidate });
  }

  private async getAnotherUser(conferenceId: string, user: ResponseUserDto): Promise<UserCombined> {
    const appointment = await this.appointmentService.getAppointment(conferenceId);
    if (!appointment) return null;
    if (user.id === appointment.doctor.userId) return { data: appointment.patient, role: Role.PATIENT };
    else return { data: appointment.doctor, role: Role.DOCTOR };
  }

  private async setUserJoined(conferenceId: string, userId: string) {
    await this.cacheManager.set(`user_conference:${userId}`, { userId, conferenceId });
  }

  private async removeUserJoined(userId: string) {
    await this.cacheManager.del(`user_conference:${userId}`);
  }

  private async isUserJoined(conferenceId: string, userId: string) {
    const data = await this.cacheManager.get<{ userId: string; conferenceId: string }>(`user_conference:${userId}`);
    return data && data.conferenceId === conferenceId;
  }

  private async getFullUser(role: Role, userId: string): Promise<UserCombined> {
    if (role === Role.DOCTOR) {
      const doctor = await this.doctorService.getDoctorByUserId(userId);
      return { role: 'DOCTOR', data: doctor };
    }

    const patient = await this.patientService.getPatientByUserId(userId);
    return { role: 'PATIENT', data: patient };
  }

  private async getUserIfJoined(socket: Socket, conferenceId: string): Promise<ResponseUserDto> {
    const user = await this.getUserByClient(socket);
    if (!user || !(await this.isUserJoined(conferenceId, user.id))) throw new BadRequestException();
    return user;
  }
}
