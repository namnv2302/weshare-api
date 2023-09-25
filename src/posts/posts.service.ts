import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from '@/posts/entities/post.entity';
import { IUser } from '@users/users.interface';
import { UsersService } from '@users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private usersService: UsersService,
  ) {}

  async create(createPostDto: CreatePostDto, user: IUser) {
    try {
      const post = this.postsRepository.create({
        ...createPostDto,
      });
      post.user = user;
      return await this.postsRepository.save(post);
    } catch (error) {
      throw new BadRequestException('Server failure! Try again');
    }
  }

  async findAll(user: IUser) {
    const itMe = await this.usersService.getUserInfoById(user.id);
    const friendsId = itMe.friends ? itMe.friends.map((user) => user.id) : [];
    return await this.postsRepository.find({
      where: [{ user: { id: user.id } }, { user: { id: In(friendsId) } }],
      order: { createdAt: 'DESC' },
      relations: ['user', 'liked'],
    });
  }

  async findAllOfMe(user: IUser) {
    return await this.postsRepository.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
      relations: ['user', 'liked'],
    });
  }

  async findOne(id: string) {
    try {
      return await this.postsRepository.findOne({
        where: { id: id },
        relations: ['user', 'liked'],
      });
    } catch (error) {
      throw new BadRequestException('Server failure! Try again');
    }
  }

  async like(id: string, user: IUser) {
    // try {
    const postFound = await this.postsRepository.findOne({
      where: { id: id },
      relations: ['liked'],
    });
    postFound.addUserLiked(user);
    return await this.postsRepository.save(postFound);
    // } catch (error) {
    //   throw new BadRequestException('Server failure! Try again');
    // }
  }

  async unlike(id: string, user: IUser) {
    // try {
    const postFound = await this.postsRepository.findOne({
      where: { id: id },
      relations: ['liked'],
    });
    postFound.liked = postFound.liked.filter((item) => item.id !== user.id);
    return await this.postsRepository.save(postFound);
    // } catch (error) {
    //   throw new BadRequestException('Server failure! Try again');
    // }
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
