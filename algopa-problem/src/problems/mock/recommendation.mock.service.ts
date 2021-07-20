import { Injectable } from '@nestjs/common';
import { RecommendationMockType } from './recommendation.mock.type';
import * as fs from 'fs';
import { join } from 'path';
@Injectable()
export class RecommendationMockService {
  getRandomProblems(limit = 20) {
    const problems = fs
      .readFileSync(join(__dirname, '../../../problems'), 'utf-8')
      .split('\n')
      .filter((p) => p.split(':').length > 1);

    const recommendationProblemsMock: RecommendationMockType[] = [];

    while (recommendationProblemsMock.length < limit && problems.length != 0) {
      const selectProblemIndex = Math.floor(Math.random() * problems.length);

      const [id, title] = problems.splice(selectProblemIndex, 1)[0].split(':');

      recommendationProblemsMock.push(
        this.createRecommendationProblemMockObject({ id, title }),
      );
    }

    return recommendationProblemsMock;
  }

  private createRecommendationProblemMockObject = ({
    id,
    title,
  }): RecommendationMockType => {
    return {
      id,
      title,
      level: 1,
      link: `https://www.acmicpc.net/problem/${id}`,
    };
  };
}
