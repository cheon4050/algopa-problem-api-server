import {
  BadRequestException,
  Body,
  Get,
  HttpException,
  Param,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { Lambda } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';
import {
  NOT_FOUND_PROBLEM_ID,
  UNAUTHORIZED_USER,
} from 'src/common/constant/error-code';
import { User } from 'src/common/decorators/user.decorator';
import { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { InitializeUserHistoryDto } from './dto/initial-user-history.dto';
import { ProblemDto } from './dto/problem.dto';
import { RoadmapDto } from './dto/roadmap.dto';
import { ProblemInfoDto } from './dto/problemInfo.dto';
import { SolvedProblemDto } from './dto/solved-problem.dto';
import { ICreateSolvedRelations } from './interfaces/create-solved-relations-request.dto';
import { RecommendationLimitValidatePipe } from './pipes/recommendation.limit.validate.pipe';
import { RecommendationTypeValidatePipe } from './pipes/recommendation.type.validate.pipe';
import { ProblemInfoIdValidatePipe } from './pipes/problemInfo.id.validate.pipe';
import { ProblemService } from './problems.service';
import { VController } from 'src/common/decorators/version-controller';

@VController({ path: 'problems', version: 'v1' })
export class ProblemController {
  constructor(
    private readonly problemService: ProblemService,
    @InjectAwsService(Lambda) private readonly lambdaService: Lambda,
  ) {}

  @Get('roadmap')
  async getRoadmap(@User() user: IJwtPayload): Promise<RoadmapDto> {
    const result = user
      ? await this.problemService.getRoadMap(user)
      : await this.problemService.getDefaultRoadmap();
    return new RoadmapDto(result);
  }

  @Get('recommendation')
  async recommendProblem(
    @User() user: IJwtPayload,
    @Query('limit', RecommendationLimitValidatePipe) limit: number,
    @Query('type', RecommendationTypeValidatePipe) type: string,
  ): Promise<ProblemDto[]> {
    if (type && !user) {
      throw new UnauthorizedException({
        code: UNAUTHORIZED_USER,
      });
    }
    const result = await this.problemService.recommendProblem(
      { limit, type },
      user,
    );

    return result.map((problem) => new ProblemDto(problem));
  }

  @Get('history')
  async getUserHistory(@User() user: IJwtPayload): Promise<SolvedProblemDto[]> {
    const result = await this.problemService.getUserHistory(user);

    return result.map((problem) => new SolvedProblemDto(problem));
  }
  @Get('info/:id')
  async getProblemsInfo(
    @Param('id', ProblemInfoIdValidatePipe) id: number,
  ): Promise<ProblemInfoDto> {
    const check = await this.problemService.checkProblem(id);
    if (check) {
      throw new BadRequestException({
        statusCode: 404,
        code: NOT_FOUND_PROBLEM_ID,
      });
    }
    const result = await this.problemService.getProblemInfo(id);
    return result;
  }

  @Post('initial/history')
  async initializeUserHistory(
    @Body() initialUserHistoryData: InitializeUserHistoryDto,
  ): Promise<void> {
    const { bojId, email, provider } = initialUserHistoryData;
    this.problemService
      .getAllProblems()
      .then((problems) => problems.map(({ number: problemId }) => problemId))
      .then((problemIds) => {
        return this.lambdaService
          .invoke({
            FunctionName: 'algopa-boj-crawler-2',
            InvocationType: 'RequestResponse',
            Payload: JSON.stringify({
              userId: bojId,
              problemIds,
              action: 'user_attempt_count',
            }),
          })
          .promise();
      })
      .then((data) => {
        const { success, statusCode, result } = JSON.parse(
          data.Payload as string,
        );
        if (!success) {
          throw new HttpException(result, statusCode);
        }

        this.problemService.createSolvedRelations({
          email: email,
          provider: provider,
          attempts: result,
        } as ICreateSolvedRelations);
      })
      .catch((err) => {});
  }
}

// import { Body, Controller, Query} from '@nestjs/common';
// import { ProblemsService } from './problems.service';
// import { VersionGet } from 'src/common/decorators/version-get.decorator';
// import { RecommendationTypeValidatePipe } from './pipes/recommendation.type.validate.pipe';
// import { RecommendationLimitValidatePipe } from './pipes/recommendation.limit.validate.pipe';
// import { IResponse } from 'src/common/interfaces/response.interface';
// import { IUserRequest } from './interfaces/request/user-request.interface';
// import { User } from 'src/common/decorators/user.decorator';
// import { IRoadMapResponse } from './interfaces/roadmap.interface';
// import { IProblemResponse } from './interfaces/response/problem-response.interface';
// import { VersionPost } from 'src/common/decorators/version-post.decorator';
// import { ICreateSolvedRelations } from './interfaces/request/create-solved-relations-request.interface';

// @Controller('problems')
// export class ProblemsController {
//   constructor(private readonly problemService: ProblemsService) {}

//   @VersionGet({ path: 'roadmap', version: 'v1' })
//   async getRoadMap(
//     @User() user: IUserRequest | null,
//   ): Promise<IResponse<IRoadMapResponse>> {
//     return {
//       success: true,
//       result: user
//         ? await this.problemService.getRoadMap(user)
//         : await this.problemService.getDefaultRoadmap(),
//     };
//   }

//   @VersionGet({ path: 'recommendation', version: 'v1' })
//   async recommendProblem(
//     @User() user: IUserRequest,
//     @Query('limit', RecommendationLimitValidatePipe) limit: number,
//     @Query('type', RecommendationTypeValidatePipe) type: string,
//   ): Promise<IResponse<IProblemResponse[]>> {
//     return {
//       success: true,
//       result: await this.problemService.recommendProblem(
//         { limit, type },
//         user,
//       ),
//     };
//   }

//   @VersionGet({ path: 'history', version: 'v1' })
//   async getUserHistory(
//     @User() user: IUserRequest,
//   ): Promise<IResponse<IProblemResponse[]>> {
//     return {
//       success: true,
//       result: await this.problemService.getUserHistory(user),
//     };
//   }

//   @VersionGet({ path: 'all', version: 'v1' })
//   async getAllProblem(): Promise<IResponse<IProblemResponse[]>> {
//     return {
//       success: true,
//       result: await this.problemService.getAllProblems(),
//     };
//   }

//   @VersionGet({ path: 'solved', version: 'v1' })
//   async getUserSolvedProblems(
//     @User() user,
//   ): Promise<IResponse<IProblemResponse[]>> {
//     return {
//       success: true,
//       result: await this.problemService.getUserSolvedProblems(user),
//     };
//   }

//   @VersionGet({ path: 'notSolved', version: 'v1' })
//   async getUserNotSolvedProblems(
//     @User() user,
//   ): Promise<IResponse<IProblemResponse[]>> {
//     return {
//       success: true,
//       result: await this.problemService.getUserNotSolvedProblems(user),
//     };
//   }

//   @VersionPost({ path: 'solved', version: 'v1' })
//   async createSolvedRelations(
//     @Body() solvedProblemsData: ICreateSolvedRelations,
//   ) {
//     return {
//       success: true,
//       result: await this.problemService.createSolvedRelations(
//         solvedProblemsData,
//       ),
//     };
//   }
// }
