import { mockRoadMap } from './roadmap.mock.type';

export const mockRoadMapData: mockRoadMap = {
  problems: [
    {
      node_id: 'p1',
      id: 2630,
      level: 3,
      link: 'https://www.acmicpc.com/problem/2630',
      title: 'aaa',
      isSolved: true,
    },
  ],
  categories: [
    {
      node_id: 'c1',
      id: 1,
      name: '다이나믹 프로그래밍',
      failureRate: 10,
      progressRate: 20,
    },
  ],
  edges: [
    {
      from: 'p1',
      to: 'c1',
    },
  ],
};
