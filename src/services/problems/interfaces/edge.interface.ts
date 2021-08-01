import { IntegerType } from '../types/integer.type';

export interface IEdge {
  start: IntegerType;
  end: IntegerType;
  type: 'next' | 'in' | 'Solved';
}
