import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
        password: this.getHashPassword(createUserDto.password),
      });
    } catch (error) {
      throw new BadRequestException('Server failure! Try again');
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  findOneByUsername(username: string) {
    return this.usersRepository.findOneBy({ email: username });
  }

  async findUserByRefreshToken(refreshToken: string) {
    return await this.usersRepository.findOneBy({ refreshToken });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
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
