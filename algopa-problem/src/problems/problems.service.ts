import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { MockRoadMapType } from './mock/roadmap.mock.type';
import { RoadmapMockService } from './mock/roadmap.mock.service';
import { RecommendationMockType } from './mock/recommendation.mock.type';
import { RecommendationMockService } from './mock/recommendation.mock.service';
import { IUserRequest } from './interfaces/request/user-request.interface';

@Injectable()
export class ProblemsService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly roadmapMockService: RoadmapMockService,
    private readonly recommendationMockService: RecommendationMockService,
  ) {}

  async getRoadMap(user?: IUserRequest): Promise<MockRoadMapType> {
    return this.roadmapMockService.createRoadMapMockData();
  }

  async recommendProblem(
    { limit, type },
    user?: IUserRequest,
  ): Promise<RecommendationMockType[]> {
    return this.recommendationMockService.getRandomProblems(limit ? limit : 20);
  }
}
