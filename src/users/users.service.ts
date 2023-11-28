import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Not, Repository } from 'typeorm';
import slug from 'slug';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import {
  CreateUserDto,
  CreateUserFromGoogleDto,
  RegisterData,
} from '@users/dto/create-user.dto';
import { UpdateUserDto } from '@users/dto/update-user.dto';
import { User } from '@users/entities/user.entity';
import { IUser } from '@users/users.interface';
import aqp from 'api-query-params';
import { MailService } from '@/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private mailService: MailService,
  ) {}

  getHashPassword(password: string) {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async create(createUserDto: CreateUserDto) {
    const isExist = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });
    if (isExist) {
      throw new BadRequestException('Email already exist!');
    }
    try {
      const newUser = await this.usersRepository.save({
        ...createUserDto,
        slug: slug(createUserDto.name, '_'),
        password: this.getHashPassword(createUserDto.password),
      });
      delete newUser.password;
      delete newUser.refreshToken;
      delete newUser.role;
      return newUser;
    } catch (error) {
      throw new BadRequestException('Server failure! Try again');
    }
  }

  async register(registerData: RegisterData) {
    const isExist = await this.usersRepository.findOneBy({
      email: registerData.email,
    });
    if (isExist) {
      throw new HttpException('Email already existed!', HttpStatus.BAD_REQUEST);
    }
    try {
      const newUser = await this.usersRepository.save({
        ...registerData,
        slug: slug(registerData.name, '_'),
        password: this.getHashPassword(registerData.password),
      });
      await this.mailService.sendVerifyEmailLink(
        newUser.id,
        newUser.email,
        newUser.name,
      );
      delete newUser.password;
      delete newUser.refreshToken;
      delete newUser.role;
      return 'OK';
    } catch (error) {
      throw new BadRequestException('Server failure! Try again');
    }
  }

  async createUserFromGoogle(createUserDto: CreateUserFromGoogleDto) {
    const isExist = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });
    if (isExist) {
      return isExist;
    }
    try {
      return await this.usersRepository.save({
        ...createUserDto,
        slug: slug(createUserDto.name, '_'),
      });
    } catch (error) {
      throw new BadRequestException('Server failure! Try again');
    }
  }

  async findAll(query: string, user: IUser) {
    const { filter } = aqp(query);
    if (filter.name) {
      return await this.usersRepository.find({
        where: {
          id: Not(user.id),
          name: Like(`%${filter.name}%`),
        },
      });
    } else {
      return await this.usersRepository.find();
    }
  }

  async getUserSuggests(
    currentPage: number,
    limit: number,
    queryString: string,
    user: IUser,
  ) {
    const { filter } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;

    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.usersRepository.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const friendsList = await this.usersRepository.findOne({
      where: { id: user.id },
      relations: ['friends'],
    });
    const friendsListId = friendsList.friends.map((user) => user.id);
    friendsListId.push(user.id);
    try {
      if (filter.name) {
        const users = await this.usersRepository.find({
          where: {
            id: Not(In(friendsListId)),
            name: Like(`%${filter.name}%`),
          },
          skip: offset,
          take: defaultLimit,
        });
        return {
          users,
          meta: {
            current: currentPage,
            pageSize: defaultLimit,
            pages: totalPages,
            total: totalItems,
          },
        };
      } else {
        const users = await this.usersRepository.find({
          where: {
            id: Not(In(friendsListId)),
          },
          skip: offset,
          take: defaultLimit,
        });
        return {
          users,
          meta: {
            current: currentPage,
            pageSize: defaultLimit,
            pages: totalPages,
            total: totalItems,
          },
        };
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Server failure! Try again');
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: id },
      });
      delete user.refreshToken;
      delete user.role;
      return user;
    } catch (error) {
      throw new BadRequestException('Server failure! Try again');
    }
  }

  findOneUserBySlug(slug: string) {
    return this.usersRepository.findOne({
      where: { slug: slug },
      order: { posts: { createdAt: 'DESC' } },
      relations: ['posts.user', 'posts.liked', 'following', 'followed'],
    });
  }

  findOneByUsername(username: string) {
    return this.usersRepository.findOne({
      where: { email: username },
      select: ['id', 'password', 'email'],
    });
  }

  async getUserInfoById(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      order: { posts: { createdAt: 'DESC' } },
      relations: [
        'posts.user',
        'posts.liked',
        'following',
        'followed',
        'friends',
      ],
    });
    delete user.refreshToken;
    delete user.role;
    return user;
  }

  async findUserByRefreshToken(refreshToken: string) {
    return await this.usersRepository.findOneBy({ refreshToken });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: id },
        order: { posts: { createdAt: 'DESC' } },
        relations: [
          'posts.user',
          'posts.liked',
          'following',
          'followed',
          'friends',
        ],
      });
      if (user) {
        return await this.usersRepository.save({ ...user, ...updateUserDto });
      } else {
        throw new BadRequestException('User not exist! Try again');
      }
    } catch (error) {
      throw new BadRequestException('Server failure! Try again');
    }
  }

  async updateAvatar(id: string, avatar: string) {
    try {
      const user = await this.usersRepository.findOneBy({ id: id });
      if (user) {
        return await this.usersRepository.save({ ...user, avatar });
      } else {
        throw new BadRequestException('User not exist! Try again');
      }
    } catch (error) {
      throw new BadRequestException('Server failure! Try again');
    }
  }

  async updateCoverPhoto(id: string, cover: string) {
    try {
      const user = await this.usersRepository.findOneBy({ id: id });
      if (user) {
        return await this.usersRepository.save({ ...user, cover });
      } else {
        throw new BadRequestException('User not exist! Try again');
      }
    } catch (error) {
      throw new BadRequestException('Server failure! Try again');
    }
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    return await this.usersRepository.update(id, {
      refreshToken,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async follow(id: string, user: IUser) {
    try {
      if (id === user.id) {
        throw new BadRequestException('Failed');
      }
      const userFound = await this.usersRepository.findOneBy({ id: id });
      const me = await this.usersRepository.findOneBy({ id: user.id });

      userFound.addUserToFollowedList(me);
      me.addUserToFollowingList(userFound);
      await this.usersRepository.save(userFound);
      await this.usersRepository.save(me);
      return 'Ok';
    } catch (error) {
      throw new BadRequestException('Server failure! Try again');
    }
  }

  async unfollow(id: string, user: IUser) {
    try {
      if (id === user.id) {
        throw new BadRequestException('Failed');
      }
      const userFound = await this.usersRepository.findOne({
        where: { id: id },
        relations: ['followed', 'following'],
      });
      const me = await this.usersRepository.findOne({
        where: { id: user.id },
        relations: ['followed', 'following'],
      });

      userFound.followed = userFound.followed.filter(
        (item) => item.id !== user.id,
      );
      me.following = me.following.filter((item) => item.id !== id);
      await this.usersRepository.save(userFound);
      await this.usersRepository.save(me);
      return 'Ok';
    } catch (error) {
      throw new BadRequestException('Server failure! Try again');
    }
  }

  async addfr(id: string, user: IUser) {
    try {
      if (id === user.id) {
        throw new BadRequestException('Failed');
      }
      const userFound = await this.usersRepository.findOne({
        where: { id: id },
        relations: ['followed', 'following', 'friends'],
      });
      const me = await this.usersRepository.findOne({
        where: { id: user.id },
        relations: ['followed', 'following', 'friends'],
      });

      userFound.following = userFound.following.filter(
        (item) => item.id !== user.id,
      );
      me.followed = me.following.filter((item) => item.id !== id);

      userFound.addUserToFriendList(me);
      me.addUserToFriendList(userFound);
      await this.usersRepository.save(userFound);
      await this.usersRepository.save(me);
      return 'Ok';
    } catch (error) {
      throw new BadRequestException('Server failure! Try again');
    }
  }

  async getFollowed(id: string) {
    try {
      return await this.usersRepository.findOne({
        where: { id },
        select: ['id'],
        relations: ['followed'],
      });
    } catch (error) {
      throw new BadRequestException('Server failure! Try again');
    }
  }

  async getFriends(id: string) {
    try {
      return await this.usersRepository.findOne({
        where: { id },
        select: ['id'],
        relations: ['friends'],
      });
    } catch (error) {
      throw new BadRequestException('Server failure! Try again');
    }
  }
}
