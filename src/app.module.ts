import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { UsersModule } from '@users/users.module';
import { User } from '@users/entities/user.entity';
import { Post } from '@/posts/entities/post.entity';
import { Story } from '@/stories/entities/story.entity';
import { AuthModule } from '@auth/auth.module';
import { PostsModule } from '@/posts/posts.module';
import { StoriesModule } from '@/stories/stories.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<string>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: null,
        database: configService.get<string>('DB_NAME'),
        entities: [User, Post, Story],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    PostsModule,
    StoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
