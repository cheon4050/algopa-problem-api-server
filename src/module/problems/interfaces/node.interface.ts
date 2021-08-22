import { IntegerType } from '../types/integer.type';

export interface INode {
  labels: ['Problem' | 'Category' | 'User'];
  properties: IUserProperty | IProblemProperty | ICategoryProperty;
  identity: IntegerType;
}

export interface ICategoryProperty {
  name: string;
  order: IntegerType;
}

export interface IUserProperty {
  bojId: string;
  email: string;
  provider: 'google' | 'github';
}
export interface IProblemProperty {
  id: IntegerType;
  title: string;
  level: IntegerType;
  link: string;
}
