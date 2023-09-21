import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slug from 'slug';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import {
  CreateUserDto,
  CreateUserFromGoogleDto,
  RegisterData,
} from '@users/dto/create-user.dto';
import { UpdateUserDto } from '@users/dto/update-user.dto';
import { User } from '@users/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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
      return await this.usersRepository.save({
        ...createUserDto,
        slug: slug(createUserDto.name, '_'),
        password: this.getHashPassword(createUserDto.password),
      });
    } catch (error) {
      throw new BadRequestException('Server failure! Try again');
    }
  }

  async register(registerData: RegisterData) {
    const isExist = await this.usersRepository.findOneBy({
      email: registerData.email,
    });
    if (isExist) {
      throw new BadRequestException('Email already exist!');
    }
    try {
      return await this.usersRepository.save({
        ...registerData,
        slug: slug(registerData.name, '_'),
        password: this.getHashPassword(registerData.password),
      });
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
        password: this.getHashPassword(''),
      });
    } catch (error) {
      throw new BadRequestException('Server failure! Try again');
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  findOneUserBySlug(slug: string) {
    return this.usersRepository.findOne({
      where: { slug: slug },
      order: { posts: { createdAt: 'DESC' } },
      relations: ['posts.user', 'posts.liked'],
    });
  }

  findOneByUsername(username: string) {
    return this.usersRepository.findOneBy({ email: username });
  }

  getUserInfoById(id: string) {
    return this.usersRepository.findOne({
      where: { id: id },
      order: { posts: { createdAt: 'DESC' } },
      relations: ['posts.user', 'posts.liked'],
    });
  }

  async findUserByRefreshToken(refreshToken: string) {
    return await this.usersRepository.findOneBy({ refreshToken });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.usersRepository.findOneBy({ id: id });
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

  async updateRefreshToken(id: string, refreshToken: string) {
    return await this.usersRepository.update(id, {
      refreshToken,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
