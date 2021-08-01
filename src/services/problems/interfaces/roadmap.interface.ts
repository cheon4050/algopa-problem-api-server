import { ICategoryResponse } from './response/category-response.interface';
import { IEdgeResponse } from './response/edge-response.interface';
import { IProblemResponse } from './response/problem-response.interface';

export interface IRoadMapResponse {
  problems: IProblemResponse[];
  categories: ICategoryResponse[];
  edges: IEdgeResponse[];
}
