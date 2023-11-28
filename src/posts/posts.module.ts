import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from '@/posts/entities/post.entity';
import { User } from '@users/entities/user.entity';
import { UsersService } from '@users/users.service';
import { MailModule } from '@/mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User]), MailModule],
  controllers: [PostsController],
  providers: [PostsService, UsersService],
})
export class PostsModule {}
