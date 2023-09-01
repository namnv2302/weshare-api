import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '@auth/local-auth.guard';
import { AuthService } from '@auth/auth.service';
import { Public } from '@/decorator/customize';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('me')
  getMe(@Request() req) {
    return req.user;
  }
}
