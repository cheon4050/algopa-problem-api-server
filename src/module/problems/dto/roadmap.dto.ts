import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { IRoadMap } from '../interfaces/roadmap.interface';
import { CategoryDto } from './category.dto';
import { EdgeDto } from './edge.dto';
import { ProblemInRoadmapDto } from './problem-in-roadmap.dto';

export class RoadmapDto implements IRoadMap {
  constructor(roadmap: IRoadMap) {
    this.problems = roadmap.problems.map(
      (problem) => new ProblemInRoadmapDto(problem),
    );
    this.categories = roadmap.categories.map(
      (category) => new CategoryDto(category),
    );
    this.edges = roadmap.edges.map((edge) => new EdgeDto(edge));
  }

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProblemInRoadmapDto)
  problems: ProblemInRoadmapDto[];

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CategoryDto)
  categories: CategoryDto[];

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => EdgeDto)
  edges: EdgeDto[];
}
