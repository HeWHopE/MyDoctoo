import { io, type Socket } from 'socket.io-client';
import { API_URL } from '../../api/axios.api';
import { type IDoctor } from '../../dataTypes/Doctor';
import { type TPatient } from '../../dataTypes/Patient';
import { type Role } from '../../dataTypes/User';

export type UserCombined =
  | {
      role: Role.DOCTOR;
      data: IDoctor;
    }
  | {
      role: Role.PATIENT;
      data: TPatient;
    };

export class VideoSignalingChannel {
  constructor(private readonly socket: Socket = io(`${API_URL}/video`, { withCredentials: true })) {}

  sendOffer(payload: { offer: RTCSessionDescriptionInit; memberId: string; conferenceId: string }) {
    this.sendSignal('new_offer', payload);
  }

  async sendAnswer(payload: { answer: RTCSessionDescriptionInit; conferenceId: string; memberId: string }) {
    this.sendSignal('new_answer', payload);
  }

  sendICECandidate(payload: { candidate: RTCIceCandidate; conferenceId: string; memberId: string }) {
    this.sendSignal('ice_candidate', payload);
  }

  async join(payload: { conferenceId: string }): Promise<{
    members: UserCombined[];
    error?: string | null;
  }> {
    return await this.sendSignalWithAck('join', payload);
  }

  leave(payload: { conferenceId: string }) {
    this.sendSignal('leave', payload);
  }

  async onMemberJoined(callback: (user: UserCombined) => void) {
    this.socket.on('member_joined', (payload: { user: UserCombined }) => {
      console.log('member_joined', payload);
      callback(payload.user);
    });
  }

  sendVideoState(payload: { conferenceId: string; isVideoOn: boolean }) {
    this.sendSignal('video_state', payload);
  }

  onVideoState(callback: (payload: { isVideoOn: boolean }) => void) {
    this.socket.on('video_state', (payload: { isVideoOn: boolean }) => {
      console.log('video_state', payload);
      callback(payload);
    });
  }

  onMemberLeft(callback: (userId: string) => void) {
    this.socket.on('member_left', (payload: { userId: string }) => {
      console.log('member_left', payload);
      callback(payload.userId);
    });
  }

  onRemoteOfferAnswer(callback: (answer: RTCSessionDescriptionInit) => void) {
    this.socket.on('answer_response', (payload: { answer: RTCSessionDescription }) => {
      console.log('answer_response', payload);
      callback(payload.answer);
    });
  }

  onRemoteOffer(callback: (offer: RTCSessionDescriptionInit, memberId: string) => void) {
    this.socket.on('new_offer', (payload: { offer: RTCSessionDescriptionInit; userId: string }) => {
      console.log('new_offer', payload);
      callback(payload.offer, payload.userId);
    });
  }

  onRemoteICECandidate(callback: (candidate: RTCIceCandidateInit) => void) {
    this.socket.on('new_ice_candidate', (payload: { candidate: RTCIceCandidateInit }) => {
      console.log('new_ice_candidate', payload);
      callback(payload.candidate);
    });
  }

  close() {
    this.socket.removeAllListeners();
    this.socket.close();
  }

  private sendSignal<T>(event: string, payload: T) {
    console.log('send signal', event, payload);
    this.socket.emit(event, payload);
  }

  private async sendSignalWithAck<T, R>(event: string, payload: T): Promise<R> {
    console.log('send signal with ack', event, payload);
    return await this.socket.emitWithAck(event, payload);
  }
}
