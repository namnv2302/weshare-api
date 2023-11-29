import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async sendVerifyEmailLink(id: string, email: string, fullname: string) {
    try {
      const payload = { id, email };
      const verifyToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('VERIFY_EMAIL_SECRET'),
      });
      const verifyLink = `${this.configService.get<string>(
        'CLIENT_BASE_URL',
      )}/verify-email?token=${verifyToken}`;

      await this.mailerService.sendMail({
        to: email,
        from: 'WeShare <ads.weshare@gmail.com>',
        subject: 'Verify your email!!',
        template: 'verify-email',
        context: {
          recipient: fullname,
          verifyLink,
        },
      });
    } catch (error) {
      throw new BadRequestException('Server failure! Try again');
    }
  }
}
