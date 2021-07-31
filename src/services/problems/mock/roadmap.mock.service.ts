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
      .readFileSync(join(__dirname, '../../../../problems'), 'utf-8')
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
              to: categoryObject.nodeId,
            }),
          );
        }

        currentCategoryNodeId = categoryObject.nodeId;
      } else if (row) {
        const [number, title] = row.split(':');
        const problemObject = this.createProblemObject({
          number: parseInt(number),
          title,
          problemLength: mockRoadMapData.problems.length,
        });
        mockRoadMapData.problems.push(problemObject);
        mockRoadMapData.edges.push(
          this.createEdgeObject({
            from: problemObject.nodeId,
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

  private createProblemObject = ({
    number,
    title,
    problemLength,
  }): ProblemType => {
    return {
      nodeId: 'p' + problemLength,
      id: Math.floor(Math.random() * 99999),
      number,
      title,
      levelImgLink: `https://algopa.s3.ap-northeast-2.amazonaws.com/level+${
        Math.floor(Math.random() * 2) + 1
      }.png`,
      link: `https://www.acmicpc.net/problem/${number}`,
      isSolved: false,
    };
  };

  private createCategoryObject = ({ name, categoryLength }): CategoryType => {
    return {
      nodeId: 'c' + categoryLength,
      id: categoryLength,
      name,
      failureRate: 0,
      progressRate: 0,
    };
  };
}
