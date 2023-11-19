import { Injectable, BadRequestException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStoryDto } from '@/stories/dto/create-story.dto';
import { IUser } from '@users/users.interface';
import { Story } from '@/stories/entities/story.entity';
import { UsersService } from '@users/users.service';

@Injectable()
export class StoriesService {
  constructor(
    @InjectRepository(Story)
    private storiesRepository: Repository<Story>,
    private usersService: UsersService,
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

  async findAll(user: IUser) {
    const itMe = await this.usersService.getUserInfoById(user.id);
    const friendsId = itMe.friends ? itMe.friends.map((user) => user.id) : [];
    return await this.storiesRepository.find({
      where: [{ owner: { id: user.id } }, { owner: { id: In(friendsId) } }],
      order: { createdAt: 'DESC' },
      relations: ['owner'],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} story`;
  }

  remove(id: number) {
    return `This action removes a #${id} story`;
  }
}
