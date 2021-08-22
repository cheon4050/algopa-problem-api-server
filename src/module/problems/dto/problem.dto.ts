import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IProblem } from '../interfaces/problem.interface';

export class ProblemDto implements IProblem {
  constructor(problem: IProblem) {
    this.nodeId = problem.nodeId;
    this.number = problem.number;
    this.level = problem.level;
    this.link = problem.link;
    this.title = problem.title;
    if (problem.categories) {
      this.categories = problem.categories;
    }
  }
  @IsNumber()
  @IsNotEmpty()
  nodeId: number;

  @IsNumber()
  @IsNotEmpty()
  number: number;

  @IsNumber()
  @IsNotEmpty()
  level: number;

  @IsString()
  @IsNotEmpty()
  link: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString({ each: true })
  @IsOptional()
  categories?: string[];
}
