import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class InitializeUserHistoryDto {
  @IsString()
  @IsNotEmpty()
  bojId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  provider: string;
}
