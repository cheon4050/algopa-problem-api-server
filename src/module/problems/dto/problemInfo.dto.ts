import {
  isNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IProblemInfo } from '../interfaces/problem.interface';

export class ProblemInfoDto implements IProblemInfo {
  constructor(problem: IProblemInfo) {
    this.number = problem.number;
    this.level = problem.level;
    this.link = problem.link;
    this.title = problem.title;
    this.categories = problem.categories;
    this.contentHTML = problem.contentHTML;
  }

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
  @IsNotEmpty()
  categories: string[];

  @IsString()
  @IsNotEmpty()
  contentHTML: string;
}
