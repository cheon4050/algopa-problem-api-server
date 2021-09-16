import { DateType } from '../types/date.type';
import { IntegerType } from '../types/integer.type';

export interface IEdgeRelationship {
  start: IntegerType;
  end: IntegerType;
  type: 'next' | 'main_tag' | 'solved';
}

export interface ISolvedEdge {
  try: IntegerType;
  date: DateType;
}
