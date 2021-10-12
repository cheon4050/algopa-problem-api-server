export interface IUserProblemSolvingData {
  success: boolean;
  isSolved: boolean;
  result: string;
  submitTimestamp: Date;
  solvedTime: number;
  executedTime: number[];
  memoryUsage?: number[];
}
