import { IntegerType } from '../types/integer.type';
import { ICategory } from './category.interface';
import { IProblem } from './problem.interface';
import { IUser } from './user.interface';

export interface INode {
  labels: ['Problem' | 'Category' | 'User'];
  properties: IUser | IProblem | ICategory;
  identity: IntegerType;
}
