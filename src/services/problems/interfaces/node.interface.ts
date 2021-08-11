import { DateType } from '../types/date.type';
import { IntegerType } from '../types/integer.type';
export interface INode {
  labels: ['Problem' | 'Category' | 'User'];
  properties: IUserNode | IProblemNode | ICategoryNode;
  identity: IntegerType;
}

export interface ICategoryNode {
  name: string;
  order: IntegerType;
}

export interface IUserNode {
  bojId: string;
  email: string;
  provider: 'google' | 'github';
}
export interface IProblemNode {
  id: IntegerType;
  title: string;
  level: IntegerType;
  link: string;
}

export interface IHistory {
  try: number;
  date: DateType;
}

export interface IcategoryList{
  name: string;
}

