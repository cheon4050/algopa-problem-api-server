export type mockRoadMap = {
  problems: [
    {
      node_id: string;
      id: number;
      level: number;
      link: string;
      title: string;
      isSolved: boolean;
    },
  ];
  categories: [
    {
      node_id: string;
      id: number;
      name: string;
      failureRate: number;
      progressRate: number;
    },
  ];
  edges: [{ from: string; to: string }];
};
