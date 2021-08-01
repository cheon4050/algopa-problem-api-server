import { Injectable } from '@nestjs/common';
import { RecommendationMockType } from './recommendation.mock.type';
import * as fs from 'fs';
import { join } from 'path';
@Injectable()
export class RecommendationMockService {
  getRandomProblems(limit = 20) {
    const problems = fs
      .readFileSync(join(__dirname, '../../../../problems'), 'utf-8')
      .split('\n')
      .filter((p) => p.split(':').length > 1);

    const recommendationProblemsMock: RecommendationMockType[] = [];

    while (recommendationProblemsMock.length < limit && problems.length != 0) {
      const selectProblemIndex = Math.floor(Math.random() * problems.length);

      const [number, title] = problems
        .splice(selectProblemIndex, 1)[0]
        .split(':');

      recommendationProblemsMock.push(
        this.createRecommendationProblemMockObject({
          number: parseInt(number),
          title,
        }),
      );
    }

    return recommendationProblemsMock;
  }

  private createRecommendationProblemMockObject = ({
    number,
    title,
  }): RecommendationMockType => {
    return {
      id: Math.floor(Math.random() * 99999),
      number,
      title,
      levelImgLink: `https://algopa.s3.ap-northeast-2.amazonaws.com/level+${
        Math.floor(Math.random() * 2) + 1
      }.png`,
      link: `https://www.acmicpc.net/problem/${number}`,
    };
  };
}
