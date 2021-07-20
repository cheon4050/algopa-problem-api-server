import { Controller, Query } from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { VersionGet } from '../common/decorators/version-get.decorator';
import { UserId } from '../common/decorators/user-id.decorator';
import { MockRoadMapType } from './mock/roadmap.mock.type';
import { RecommendationTypeValidatePipe } from './pipes/recommendation.type.validate.pipe';
import { RecommendationMockType } from './mock/recommendation.mock.type';
import { RecommendationLimitValidatePipe } from './pipes/recommendation.limit.validate.pipe';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @VersionGet({ path: 'roadmap', version: 'v1' })
  async getRoadMap(@UserId() userId: number): Promise<MockRoadMapType> {
    return await this.problemsService.getRoadMap(userId);
  }

  @VersionGet({ path: 'recommendation', version: 'v1' })
  async recommendProblem(
    @UserId() userId: number,
    @Query('limit', RecommendationLimitValidatePipe) limit: number,
    @Query('type', RecommendationTypeValidatePipe) type: string,
  ): Promise<RecommendationMockType[]> {
    return await this.problemsService.recommendProblem({ userId, limit, type });
  }
}
