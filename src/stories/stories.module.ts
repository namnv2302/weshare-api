import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoriesService } from './stories.service';
import { StoriesController } from './stories.controller';
import { Story } from '@/stories/entities/story.entity';
import { UsersService } from '@users/users.service';
import { User } from '@users/entities/user.entity';
import { MailModule } from '@/mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Story, User]), MailModule],
  controllers: [StoriesController],
  providers: [StoriesService, UsersService],
})
export class StoriesModule {}
