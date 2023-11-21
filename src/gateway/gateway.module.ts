import { Module } from '@nestjs/common';
import { Gateway } from '@/gateway/gateway';

@Module({
  imports: [Gateway],
})
export class GatewayModule {}
