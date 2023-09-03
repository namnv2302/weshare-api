import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '@auth/local-auth.guard';
import { AuthService } from '@auth/auth.service';
import { Public, ResponseMessage } from '@/decorator/customize';
import { User } from '@/decorator/user.decorator';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('User login')
  @Post('login')
  login(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @Get('me')
  getMe(@User() user: any) {
    return user;
  }

  @Public()
  @Get('refresh')
  refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];
    return this.authService.refreshToken(refreshToken, response);
  }

  @Get('logout')
  @ResponseMessage('Logout user')
  logout(@User() user: any, @Res({ passthrough: true }) response: Response) {
    return this.authService.logout(user, response);
  }
}
