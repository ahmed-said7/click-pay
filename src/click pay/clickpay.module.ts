import { Module } from '@nestjs/common';
import { ClickPayService } from './clickpay.service';
import { ClickPayController } from './clickpay.controller';

@Module({
  providers: [ClickPayService],
  controllers: [ClickPayController],
})
export class ClickPayModule {}
