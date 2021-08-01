import { IntegerType } from '../types/integer.type';

export interface IProblem {
  id: IntegerType;
  title: string;
  level: IntegerType;
  link: string;
}
