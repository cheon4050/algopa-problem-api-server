import { Injectable } from '@nestjs/common';
import {
  CategoryType,
  EdgeType,
  MockRoadMapType,
  ProblemType,
} from './roadmap.mock.type';
import * as fs from 'fs';
import { join } from 'path';
@Injectable()
export class RoadmapMockService {
  async createRoadMapMockData(): Promise<MockRoadMapType> {
    const mockRoadMapData: MockRoadMapType = {
      problems: [],
      categories: [],
      edges: [],
    };
    const problems = fs
      .readFileSync(join(__dirname, '../../../problems'), 'utf-8')
      .split('\n');

    let currentCategoryNodeId = '';

    for (const row of problems) {
      if (row && row.split(':').length == 1) {
        const categoryObject = this.createCategoryObject({
          name: row,
          categoryLength: mockRoadMapData.categories.length,
        });
        mockRoadMapData.categories.push(categoryObject);

        if (mockRoadMapData.categories.length > 1) {
          mockRoadMapData.edges.push(
            this.createEdgeObject({
              from: currentCategoryNodeId,
              to: categoryObject.node_id,
            }),
          );
        }

        currentCategoryNodeId = categoryObject.node_id;
      } else if (row) {
        const [id, title] = row.split(':');
        const problemObject = this.createProblemObject({
          id,
          title,
          problemLength: mockRoadMapData.problems.length,
        });
        mockRoadMapData.problems.push(problemObject);
        mockRoadMapData.edges.push(
          this.createEdgeObject({
            from: problemObject.node_id,
            to: currentCategoryNodeId,
          }),
        );
      } else {
      }
    }

    return mockRoadMapData;
  }

  private createEdgeObject = ({ from, to }): EdgeType => {
    return {
      from,
      to,
    };
  };

  private createProblemObject = ({ id, title, problemLength }): ProblemType => {
    return {
      node_id: 'p' + problemLength,
      id,
      title,
      level: 1,
      link: `https://www.acmicpc.net/problem/${id}`,
      isSolved: false,
    };
  };

  private createCategoryObject = ({ name, categoryLength }): CategoryType => {
    return {
      node_id: 'c' + categoryLength,
      id: categoryLength,
      name,
      failureRate: 0,
      progressRate: 0,
    };
  };
}
