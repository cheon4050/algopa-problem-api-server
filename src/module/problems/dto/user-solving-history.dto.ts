import { IsNotEmpty, IsString, IsBoolean, IsNumber } from 'class-validator';
import { IUserProblemSolvingData } from '../interfaces/user-problem-solving-history.interface';
export class UserSolvingHistoryDto implements IUserProblemSolvingData {
  @IsBoolean()
  @IsNotEmpty()
  success: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isSolved: boolean;

  @IsString()
  @IsNotEmpty()
  submitTimestamp: string;

  @IsNumber()
  @IsNotEmpty()
  solvedTime: number;

  @IsNumber({}, { each: true })
  @IsNotEmpty()
  executedTime: number[];
}
