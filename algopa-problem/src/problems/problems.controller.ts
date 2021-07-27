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
  async getRoadMap(
    @UserId(false) userId: number | null,
  ): Promise<MockRoadMapType> {
    if (userId) {
      return await this.problemsService.getRoadMap(userId);
    } else {
      // default
      return await this.problemsService.getRoadMap();
    }
  }

  @VersionGet({ path: 'recommendation', version: 'v1' })
  async recommendProblem(
    @UserId(false) userId: number | null,
    @Query('limit', RecommendationLimitValidatePipe) limit: number,
    @Query('type', RecommendationTypeValidatePipe) type: string,
  ): Promise<RecommendationMockType[]> {
    if (userId) {
      return await this.problemsService.recommendProblem(
        { limit, type },
        userId,
      );
    } else {
      // default
      return await this.problemsService.recommendProblem({ limit, type });
    }
  }
}
