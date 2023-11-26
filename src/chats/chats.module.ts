import { Module } from '@nestjs/common';
import { ChatsService } from '@/chats/chats.service';
import { ChatsController } from '@/chats/chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from '@/chats/entities/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat])],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [ChatsService],
})
export class ChatsModule {}
