import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { User } from '@/decorator/user.decorator';
import { IUser } from '@users/users.interface';

@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Post()
  create(@Body() createStoryDto: CreateStoryDto, @User() user: IUser) {
    return this.storiesService.create(createStoryDto, user);
  }

  @Get()
  findAll(@User() user: IUser) {
    return this.storiesService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storiesService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storiesService.remove(+id);
  }
}
