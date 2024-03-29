import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ICategory } from '../interfaces/category.interface';

export class CategoryDto implements ICategory {
  constructor(category?: ICategory) {
    if (category) {
      this.nodeId = category.nodeId;
      this.name = category.name;
      this.order = category.order;
      this.problemCount = category.problemCount;

      if (category.failureRate !== undefined) {
        this.failureRate = category.failureRate;
      }
      if (category.progressRate !== undefined) {
        this.progressRate = category.progressRate;
      }

      if (category.solvedCount !== undefined) {
        this.solvedCount = category.solvedCount;
      }
    }
  }
  @IsNumber()
  @IsNotEmpty()
  nodeId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  order: number;

  @IsNumber()
  @IsOptional()
  failureRate?: number;

  @IsNumber()
  @IsNotEmpty()
  problemCount: number;

  @IsNumber()
  @IsOptional()
  progressRate?: number;

  @IsNumber()
  @IsOptional()
  solvedCount?: number;
}
