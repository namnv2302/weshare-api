import { IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  chatId: string;

  @IsNotEmpty()
  senderId: string;

  @IsNotEmpty()
  recipientId: string;

  @IsNotEmpty()
  text: string;
}
