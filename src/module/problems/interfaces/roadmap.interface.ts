import { ICategory } from './category.interface';
import { IEdge } from './edge.interface';
import { IProblem, IRoadmapProblem } from './problem.interface';

export interface IRoadMap {
  problems: IRoadmapProblem[] | IProblem[];
  categories: ICategory[];
  edges: IEdge[];
}
