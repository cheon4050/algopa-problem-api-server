import { Module, OnModuleInit } from '@nestjs/common';
import { ProblemsController } from './problems.controller';
import { ProblemsService } from './problems.service';
import { Neo4jService } from 'nest-neo4j';
import { RoadmapMockService } from './mock/roadmap.mock.service';
import { RecommendationMockService } from './mock/recommendation.mock.service';

@Module({
  controllers: [ProblemsController],
  providers: [ProblemsService, RoadmapMockService, RecommendationMockService],
})
export class ProblemsModule implements OnModuleInit {
  constructor(private readonly neo4jService: Neo4jService) {}

  async onModuleInit() {
    await this.neo4jService
      .write(`CREATE CONSTRAINT ON (p:Problem) ASSERT p.id IS UNIQUE`)
      .catch(() => {});
  }
}