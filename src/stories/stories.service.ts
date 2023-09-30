import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStoryDto } from './dto/create-story.dto';
import { IUser } from '@users/users.interface';
import { Story } from '@/stories/entities/story.entity';

@Injectable()
export class StoriesService {
  constructor(
    @InjectRepository(Story)
    private storiesRepository: Repository<Story>,
  ) {}

  async create(createStoryDto: CreateStoryDto, user: IUser) {
    try {
      const story = this.storiesRepository.create({
        ...createStoryDto,
      });
      story.owner = user;
      return await this.storiesRepository.save(story);
    } catch (error) {
      throw new BadRequestException('Server failure! Try again');
    }
  }

  findAll() {
    return `This action returns all stories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} story`;
  }

  remove(id: number) {
    return `This action removes a #${id} story`;
  }
}
