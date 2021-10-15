import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class InitializeUserHistoryDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  provider: string;

  @IsString({ each: true })
  @IsOptional()
  desiredCompanies: string[];
}
