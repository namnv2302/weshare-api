import { Controller } from '@nestjs/common';
import { MailService } from '@/mail/mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}
}
