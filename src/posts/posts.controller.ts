import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ResponseMessage } from '@/decorator/customize';
import { User } from '@/decorator/user.decorator';
import { IUser } from '@users/users.interface';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ResponseMessage('Create a new post')
  async create(@Body() createPostDto: CreatePostDto, @User() user: IUser) {
    return this.postsService.create(createPostDto, user);
  }

  @Get()
  @ResponseMessage('Find all post list')
  findAll() {
    return this.postsService.findAll();
  }

  @Get('/me')
  @ResponseMessage('Find all post list of me')
  findAllOfMe(@User() user: IUser) {
    return this.postsService.findAllOfMe(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Get(':id/like')
  like(@Param('id') id: string, @User() user: IUser) {
    return this.postsService.like(+id, user);
  }

  @Get(':id/unlike')
  unlike(@Param('id') id: string, @User() user: IUser) {
    return this.postsService.unlike(+id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
