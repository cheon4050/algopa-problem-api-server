import { IsBoolean, IsNotEmpty } from 'class-validator';
import { IRoadmapProblem } from '../interfaces/problem.interface';
import { ProblemDto } from './problem.dto';

export class ProblemInRoadmapDto extends ProblemDto implements IRoadmapProblem {
  constructor(problem: IRoadmapProblem) {
    super(problem);
    this.isSolved = problem.isSolved;
  }
  @IsBoolean()
  @IsNotEmpty()
  isSolved: boolean;
}
