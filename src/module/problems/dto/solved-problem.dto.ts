import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ISolvedProblem } from '../interfaces/problem.interface';
import { ProblemDto } from './problem.dto';

export class SolvedProblemDto extends ProblemDto implements ISolvedProblem {
  constructor(problem: ISolvedProblem) {
    super(problem);
    this.tryCount = problem.tryCount;
    this.date = problem.date;
  }
  @IsNumber()
  @IsNotEmpty()
  tryCount: number;

  @IsString()
  @IsNotEmpty()
  date: string;
}
