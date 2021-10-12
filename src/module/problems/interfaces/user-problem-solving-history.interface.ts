export interface IUserProblemSolvingData {
  success: boolean;
  isSolved: boolean;
  submitTimestamp: Date;
  solvedTime: number;
  executedTime: number[];
  memoryUsage?: number[];
}
