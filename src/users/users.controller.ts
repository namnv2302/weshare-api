import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@/decorator/user.decorator';
import { IUser } from '@users/users.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('followed')
  getFollowed(@User() user: IUser) {
    return this.usersService.getFollowed(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get(':slug/profile')
  findOneUserBySlug(@Param('slug') slug: string) {
    return this.usersService.findOneUserBySlug(slug);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/avatar')
  updateAvatar(@Param('id') id: string, @Body('avatar') avatar: string) {
    return this.usersService.updateAvatar(id, avatar);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Get(':id/follow')
  follow(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.follow(id, user);
  }

  @Get(':id/unfollow')
  unfollow(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.unfollow(id, user);
  }

  @Get(':id/addfr')
  addfr(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.addfr(id, user);
  }
}
