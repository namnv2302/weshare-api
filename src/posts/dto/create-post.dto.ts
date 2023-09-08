import { IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  status: string;

  @IsString()
  postUrl: string;
}
