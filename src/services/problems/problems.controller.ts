import { Controller, Query } from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { VersionGet } from 'src/common/decorators/version-get.decorator';
import { MockRoadMapType } from './mock/roadmap.mock.type';
import { RecommendationTypeValidatePipe } from './pipes/recommendation.type.validate.pipe';
import { RecommendationMockType } from './mock/recommendation.mock.type';
import { RecommendationLimitValidatePipe } from './pipes/recommendation.limit.validate.pipe';
import { IResponse } from 'src/common/interfaces/response.interface';
import { IUserRequest } from './interfaces/request/user-request.interface';
import { User } from 'src/common/decorators/user.decorator';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @VersionGet({ path: 'roadmap', version: 'v1' })
  async getRoadMap(
    @User() user: IUserRequest | null,
  ): Promise<IResponse<MockRoadMapType>> {
    if (user) {
      return {
        success: true,
        result: await this.problemsService.getRoadMap(user),
      };
    } else {
      // default

      return { success: true, result: await this.problemsService.getRoadMap() };
    }
  }

  @VersionGet({ path: 'recommendation', version: 'v1' })
  async recommendProblem(
    @User() user: IUserRequest,
    @Query('limit', RecommendationLimitValidatePipe) limit: number,
    @Query('type', RecommendationTypeValidatePipe) type: string,
  ): Promise<IResponse<RecommendationMockType[]>> {
    if (user) {
      return {
        success: true,
        result: await this.problemsService.recommendProblem(
          { limit, type },
          user,
        ),
      };
    } else {
      // default
      return {
        success: true,
        result: await this.problemsService.recommendProblem({ limit, type }),
      };
    }
  }
}
