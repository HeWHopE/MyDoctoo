import Stripe from 'stripe';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppointmentStatus } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppointmentService } from '../appointment/appointment.service';
import { PrismaService } from '../prisma/prisma.service';
import { PatchAppointmentDto } from '../appointment/dto/patch.dto';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly appointmentService: AppointmentService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_API_KEY'), { apiVersion: '2024-04-10' });
  }

  async createPayment(id: string): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    await this.appointmentService.isAppointmentExists(id);

    const appointment = await this.prismaService.appointment.findUnique({ where: { id } });

    try {
      const payment = await this.stripe.paymentIntents.create({ amount: appointment.price * 100, currency: 'USD' });

      return payment;
    } catch (err) {
      throw new BadRequestException('Something bad happened during creating payment.');
    }
  }

  async setSuccessfulPayment(id: string) {
    await this.appointmentService.isAppointmentExists(id);

    const patchData: PatchAppointmentDto = {
      status: AppointmentStatus.PLANNED,
    };

    const updatedAppointment = await this.appointmentService.patchAppointment(id, patchData);

    this.eventEmitter.emit('payment.successful', {
      patientId: updatedAppointment.patientId,
      doctorId: updatedAppointment.doctorId,
      appointmentId: updatedAppointment.id,
    });

    return updatedAppointment;
  }
}
