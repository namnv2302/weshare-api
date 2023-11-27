import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateMessageDto } from '@/messages/dto/create-message.dto';
import { UpdateMessageDto } from '@/messages/dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '@/messages/entities/message.entity';
import { Repository } from 'typeorm';
import { ChatsService } from '@/chats/chats.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    private chatsService: ChatsService,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    try {
      const message = await this.messagesRepository.save({
        ...createMessageDto,
      });
      await this.chatsService.update(message.chatId, {
        sendLastAt: new Date(),
      });
      return message;
    } catch (error) {
      throw new BadRequestException('Server failure! Try again');
    }
  }

  findAll() {
    return `This action returns all messages`;
  }

  async getMessagesUnread() {
    try {
      const messages = await this.messagesRepository.find({
        where: { isRead: false },
        order: { createdAt: 'DESC' },
      });
      return messages;
    } catch (error) {
      throw new BadRequestException('Server failure! Try again');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  async getMessagesByChatId(chatId: string) {
    try {
      const messages = await this.messagesRepository.find({
        where: { chatId },
        order: { createdAt: 'ASC' },
      });
      return messages;
    } catch (error) {
      throw new BadRequestException('Server failure! Try again');
    }
  }

  async update(id: string, updateMessageDto: UpdateMessageDto) {
    try {
      const message = await this.messagesRepository.findOneBy({ id });

      if (message) {
        const updateMess = await this.messagesRepository.save({
          ...message,
          ...updateMessageDto,
        });
        return updateMess;
      } else {
        throw new HttpException('Not found message', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new BadRequestException('Server failure! Try again');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
