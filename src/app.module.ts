import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClickPayModule } from './click pay/clickpay.module';

@Module({
  imports: [ClickPayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
