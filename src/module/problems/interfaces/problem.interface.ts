export interface IProblem {
  nodeId: number;
  number: number;
  level: number;
  link: string;
  title: string;
  categories?: string[];
}

export interface ISolvedProblem extends IProblem {
  tryCount: number;
  date: string;
}

export interface IRoadmapProblem extends IProblem {
  isSolved: boolean;
}
