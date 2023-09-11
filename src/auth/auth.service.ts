import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import ms from 'ms';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@users/users.service';
import { RegisterData } from '@users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValid = await this.usersService.isValidPassword(
        pass,
        user.password,
      );
      if (isValid) {
        return user;
      }
    }
    return null;
  }

  async login(user: any, response: Response) {
    const payload = {
      sub: 'token login',
      iss: 'from server',
      id: user.id,
      email: user.email,
    };

    const refreshToken = this.createRefreshToken(payload);
    await this.usersService.updateRefreshToken(user.id, refreshToken);

    // Set refresh token with cookie
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
    });

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async handleGoogleLogin(user: any, response: Response) {
    const result = await this.usersService.createUserFromGoogle(user);
    if (result) {
      return await this.login(user, response);
    }
  }

  getMe(id: string) {
    if (id) {
      return this.usersService.getUserInfoById(id);
    }
  }

  register(registerData: RegisterData) {
    const newUser = this.usersService.register(registerData);
    if (newUser) {
      return 'OK';
    }
  }

  createRefreshToken(payload) {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn:
        ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000,
    });
    return refresh_token;
  }

  async refreshToken(refreshToken: string, response: Response) {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });
      const user = await this.usersService.findUserByRefreshToken(refreshToken);
      if (user) {
        const payload = {
          sub: 'token refresh',
          iss: 'from server',
          id: user.id,
          email: user.email,
        };
        const refreshToken = this.createRefreshToken(payload);
        await this.usersService.updateRefreshToken(user.id, refreshToken);
        response.clearCookie('refresh_token');
        response.cookie('refresh_token', refreshToken, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
        });

        return {
          access_token: this.jwtService.sign(payload),
        };
      } else {
        throw new BadRequestException('Refresh token invalid. Login again!');
      }
    } catch (error) {
      throw new BadRequestException('Refresh token invalid. Login again!');
    }
  }

  async logout(user: any, response: Response) {
    await this.usersService.updateRefreshToken(user.id, null);
    response.clearCookie('refresh_token');
    return 'OK';
  }
}
