import { IcategoryList } from '../node.interface';

export interface IProblemResponse {
  nodeId: number;
  number: number;
  level: number;
  link: string;
  title: string;
  isSolved?: boolean;
  tryCount?: number;
  date?: string;
  categories?: IcategoryList[];
}
