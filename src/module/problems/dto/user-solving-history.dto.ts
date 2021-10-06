import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsDate,
  IsNumber,
} from 'class-validator';
import { IUserProblemSolvingData } from '../interfaces/user-problem-solving-history.interface';
export class UserSolvingHistoryDto implements IUserProblemSolvingData {
  @IsBoolean()
  @IsNotEmpty()
  success: boolean;

  @IsString()
  @IsNotEmpty()
  result: string;

  @IsBoolean()
  @IsNotEmpty()
  isSolved: boolean;

  @IsString()
  @IsNotEmpty()
  submitTimestamp: string;

  @IsNumber()
  @IsNotEmpty()
  solvedTime: number;

  @IsNumber()
  @IsNotEmpty()
  executedTime: number;
}
