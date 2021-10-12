import {
  IsNotEmpty,
  IsDateString,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
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
  result: string;

  @IsDateString()
  @IsNotEmpty()
  submitTimestamp: Date;

  @IsNumber()
  @IsNotEmpty()
  solvedTime: number;

  @IsNumber({}, { each: true })
  @IsNotEmpty()
  executedTime: number[];

  @IsNumber({}, { each: true })
  @IsOptional()
  memoryUsage?: number[];
}
