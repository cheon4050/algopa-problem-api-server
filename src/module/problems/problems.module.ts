import { Module, OnModuleInit } from '@nestjs/common';
import { ProblemService } from './problems.service';
import { Neo4jService } from 'nest-neo4j';
import { ProblemController } from './problems.controller';
import { LambdaProviderModule } from 'src/provider/aws/lambda/provider.module';

@Module({
  imports: [LambdaProviderModule],
  controllers: [ProblemController],
  providers: [ProblemService],
})
export class ProblemsModule implements OnModuleInit {
  constructor(private readonly neo4jService: Neo4jService) {}

  async onModuleInit() {
    await this.neo4jService
      .write(`CREATE CONSTRAINT ON (p:Problem) ASSERT p.id IS UNIQUE`)
      .catch(() => {});
  }
}
