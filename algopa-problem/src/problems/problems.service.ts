import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { mockRoadMap } from './mock/roadmap.mock.type';
import { mockRoadMapData } from './mock/roadmap.mock.data';

@Injectable()
export class ProblemsService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async getRoadMap(userId: number): Promise<mockRoadMap> {
    return mockRoadMapData;
  }
}
