import { Controller, Post, Body, Req } from '@nestjs/common';

import { IsNumber, IsString } from 'class-validator';
import { ClickPayService } from './clickpay.service';
import { console } from 'inspector';

export class CreatePaymentDto {
  @IsString()
  orderId: string;

  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  // @IsObject()
  // customerDetails: any;
}

@Controller('clickpay')
export class ClickPayController {
  constructor(private clickPayService: ClickPayService) {}

  // Endpoint to create a payment
  @Post('create-payment')
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    const { orderId, amount } = createPaymentDto;
    return this.clickPayService.createPayment(
      orderId,
      amount,
      // currency,
      // customerDetails,
    );
  }

  // Endpoint to handle callback from ClickPay
  @Post('callback')
  async handleCallback(@Req() req: any) {
    console.log(req.body);
    console.log(req.query);
  }
  @Post('return')
  async handleReturn() {
    return { status: 'success' };
  }
}
