export type MockRoadMapType = {
  problems: ProblemType[];
  categories: CategoryType[];
  edges: EdgeType[];
};

export type ProblemType = {
  nodeId: string;
  id: number;
  number: number;
  levelImgLink: string;
  link: string;
  title: string;
  isSolved: boolean;
};

export type CategoryType = {
  nodeId: string;
  id: number;
  name: string;
  failureRate: number;
  progressRate: number;
};

export type EdgeType = {
  from: string;
  to: string;
};
