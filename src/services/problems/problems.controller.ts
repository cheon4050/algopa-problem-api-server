import { Controller, Query, Version } from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { VersionGet } from 'src/common/decorators/version-get.decorator';
import { RecommendationTypeValidatePipe } from './pipes/recommendation.type.validate.pipe';
import { RecommendationLimitValidatePipe } from './pipes/recommendation.limit.validate.pipe';
import { IResponse } from 'src/common/interfaces/response.interface';
import { IUserRequest } from './interfaces/request/user-request.interface';
import { User } from 'src/common/decorators/user.decorator';
import { IRoadMapResponse } from './interfaces/roadmap.interface';
import { IProblemResponse } from './interfaces/response/problem-response.interface';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @VersionGet({ path: 'roadmap', version: 'v1' })
  async getRoadMap(
    @User() user: IUserRequest | null,
  ): Promise<IResponse<IRoadMapResponse>> {
    return {
      success: true,
      result: await this.problemsService.getRoadMap(user),
    };
  }

  @VersionGet({ path: 'recommendation', version: 'v1' })
  async recommendProblem(
    @User() user: IUserRequest,
    @Query('limit', RecommendationLimitValidatePipe) limit: number,
    @Query('type', RecommendationTypeValidatePipe) type: string,
  ): Promise<IResponse<IProblemResponse[]>> {
    return {
      success: true,
      result: await this.problemsService.recommendProblem(
        { limit, type },
        user,
      ),
    };
  }

  @VersionGet({ path: 'history', version: 'v1' })
  async getUserHistory(
    @User() user: IUserRequest,
  ): Promise<IResponse<IProblemResponse[]>> {
    return {
      success: true,
      result: await this.problemsService.getUserHistory(user),
    };
  }

  @VersionGet({ path: 'all', version: 'v1' })
  async getAllProblem(): Promise<IResponse<IProblemResponse[]>> {
    return {
      success: true,
      result: await this.problemsService.getAllProblems(),
    };
  }

  @VersionGet({ path: 'solved', version: 'v1' })
  async getUserSolvedProblems(
    @User() user,
  ): Promise<IResponse<IProblemResponse[]>> {
    return {
      success: true,
      result: await this.problemsService.getUserSolvedProblems(user),
    };
  }
}
