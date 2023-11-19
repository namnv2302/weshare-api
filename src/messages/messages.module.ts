import { Module } from '@nestjs/common';
import { MessagesService } from '@/messages/messages.service';
import { MessagesController } from '@/messages/messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '@/messages/entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
