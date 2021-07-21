export type MockRoadMapType = {
  problems: ProblemType[];
  categories: CategoryType[];
  edges: EdgeType[];
};

export type ProblemType = {
  node_id: string;
  id: number;
  levelImgLink: string;
  link: string;
  title: string;
  isSolved: boolean;
};

export type CategoryType = {
  node_id: string;
  id: number;
  name: string;
  failureRate: number;
  progressRate: number;
};

export type EdgeType = {
  from: string;
  to: string;
};
