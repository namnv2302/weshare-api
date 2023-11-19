import { IsNotEmpty } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  firstId: string;

  @IsNotEmpty()
  secondId: string;
}
