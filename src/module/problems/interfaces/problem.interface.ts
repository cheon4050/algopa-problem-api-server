export interface IProblem {
  nodeId: number;
  id: number;
  level: number;
  link: string;
  title: string;
  categories?: string[];
}
export interface IProblemInfo {
  id: number;
  level: number;
  link: string;
  title: string;
  categories: string[];
  contentHTML: string;
}
export interface ISolvedProblem extends IProblem {
  tryCount: number;
  date: string;
}

export interface IRoadmapProblem extends IProblem {
  isSolved: boolean;
}
