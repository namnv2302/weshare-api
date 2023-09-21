import { Module } from '@nestjs/common';
import { MyGateway } from '@/gateway/gateway';

@Module({
  providers: [MyGateway],
})
export class GatewayModule {}
