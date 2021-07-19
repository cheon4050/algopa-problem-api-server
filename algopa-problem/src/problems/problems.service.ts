import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { MockRoadMapType } from './mock/roadmap.mock.type';
import { RoadmapMockService } from './mock/roadmap.mock.service';

@Injectable()
export class ProblemsService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly roadmapMockService: RoadmapMockService,
  ) {}

  async getRoadMap(userId: number): Promise<MockRoadMapType> {
    return this.roadmapMockService.createRoadMapMockData();
  }
}
