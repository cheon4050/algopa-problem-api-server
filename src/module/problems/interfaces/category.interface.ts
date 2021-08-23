export interface ICategory {
  nodeId: number;
  name: string;
  order: number;
  problemCount: number;
  failureRate?: number;
  progressRate?: number;
  solvedCount?: number;
}
