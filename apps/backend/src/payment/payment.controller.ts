import { Controller, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiParam,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import Stripe from 'stripe';
import { BadRequestResponse } from '../utils/BadRequestResponse';
import { ClassicNestResponse } from '../utils/ClassicNestResponse';
import { RESPONSE_STATUS } from '../utils/constants';
import { PaymentService } from './payment.service';

@ApiTags('Payment Endpoints')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post(':id')
  @ApiOperation({ summary: 'Create payment invoice' })
  @ApiOkResponse({ description: RESPONSE_STATUS.SUCCESS })
  @ApiBadRequestResponse({ type: BadRequestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'id', example: 'fb40e3fb-c1ee-4c80-b2cf-00e4110eb825', description: 'The appointments unique id.' })
  async createPayment(@Param('id') id: string): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    return await this.paymentService.createPayment(id);
  }

  @Post('successful/:id')
  @ApiOperation({ summary: 'Change appointments status after successful payment' })
  @ApiOkResponse({ description: RESPONSE_STATUS.SUCCESS })
  @ApiInternalServerErrorResponse({ type: ClassicNestResponse, description: RESPONSE_STATUS.ERROR })
  @ApiParam({ name: 'id', example: 'fb40e3fb-c1ee-4c80-b2cf-00e4110eb825', description: 'The appointments unique id.' })
  async successfulPayment(@Param('id') id: string) {
    return await this.paymentService.setSuccessfulPayment(id);
  }
}
