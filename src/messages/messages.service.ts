import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMessageDto } from '@/messages/dto/create-message.dto';
import { UpdateMessageDto } from '@/messages/dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '@/messages/entities/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    try {
      const message = await this.messagesRepository.save({
        ...createMessageDto,
      });
      return message;
    } catch (error) {
      throw new BadRequestException('Server failure! Try again');
    }
  }

  findAll() {
    return `This action returns all messages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  async getMessagesByChatId(chatId: string) {
    try {
      const messages = await this.messagesRepository.find({
        where: { chatId },
      });
      return messages;
    } catch (error) {
      throw new BadRequestException('Server failure! Try again');
    }
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
