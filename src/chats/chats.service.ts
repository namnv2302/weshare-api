import { BadRequestException, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateChatDto } from '@/chats/dto/create-chat.dto';
import { UpdateChatDto } from '@/chats/dto/update-chat.dto';
import { Chat } from '@/chats/entities/chat.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,
  ) {}

  async create(createChatDto: CreateChatDto) {
    try {
      const { firstId, secondId } = createChatDto;
      const chatExisted = await this.chatsRepository.findOne({
        where: {
          firstId: In([firstId, secondId]),
          secondId: In([firstId, secondId]),
        },
      });
      if (chatExisted) {
        return chatExisted;
      }
      return await this.chatsRepository.save({
        firstId,
        secondId,
      });
    } catch (error) {
      throw new BadRequestException('Server failure! Try again');
    }
  }

  findAll() {
    return `This action returns all chats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  async findUserChats(userId: string) {
    try {
      const chats = await this.chatsRepository.find({
        where: [
          {
            firstId: userId,
          },
          {
            secondId: userId,
          },
        ],
        order: { sendLastAt: 'DESC' },
      });
      return chats;
    } catch (error) {
      throw new BadRequestException('Server failure! Try again');
    }
  }

  async findChat(firstId: string, secondId: string) {
    try {
      const chat = await this.chatsRepository.findOne({
        where: {
          firstId: In([firstId, secondId]),
          secondId: In([firstId, secondId]),
        },
      });
      return chat;
    } catch (error) {
      throw new BadRequestException('Server failure! Try again');
    }
  }

  async update(id: string, updateChatDto: UpdateChatDto) {
    try {
      const chat = await this.chatsRepository.findOneBy({ id: id });
      if (chat) {
        return await this.chatsRepository.save({ ...chat, ...updateChatDto });
      }
    } catch (error) {
      throw new BadRequestException('Server failure! Try again');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
