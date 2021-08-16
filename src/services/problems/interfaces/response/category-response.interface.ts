export interface ICategoryResponse {
  nodeId: number;
  name: string;
  order: number;
  failureRate?: number;
  progressRate?: number;
  problemCount: number;
  solvedCount?: number;
}
