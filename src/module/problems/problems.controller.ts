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
import { UserSolvingHistoryDto } from './dto/user-solving-history.dto';
import { ProblemDto } from './dto/problem.dto';
import { TestcaseDto } from './dto/problemTestcase.dto';
import { RoadmapDto } from './dto/roadmap.dto';
import { ProblemInfoDto } from './dto/problemInfo.dto';
import { SolvedProblemDto } from './dto/solved-problem.dto';
import { ICreateSolvedRelations } from './interfaces/create-solved-relations-request.dto';
import { RecommendationLimitValidatePipe } from './pipes/recommendation.limit.validate.pipe';
import { RecommendationTypeValidatePipe } from './pipes/recommendation.type.validate.pipe';
import { ProblemIdValidatePipe } from './pipes/problemInfo.id.validate.pipe';
import { ProblemService } from './problems.service';
import { VController } from 'src/common/decorators/version-controller';
import { RoadmapTypeValidatePipe } from './pipes/Roadmap.type.validate.pipe';
import { IUserProblemSolvingData } from './interfaces/user-problem-solving-history.interface';
import { RecommendationCompanyValidatePipe } from './pipes/recommendation.company.validate.pipe';
@VController({ path: 'problems', version: 'v1' })
export class ProblemController {
  constructor(
    private readonly problemService: ProblemService,
    @InjectAwsService(Lambda) private readonly lambdaService: Lambda,
  ) {}

  @Get('roadmap')
  async getRoadmap(
    @User() user: IJwtPayload,
    @Query('type', RoadmapTypeValidatePipe) type: string,
  ): Promise<RoadmapDto> {
    const result = await this.problemService.getRoadmap(type, user);
    return new RoadmapDto(result);
  }

  @Get('recommendation')
  async recommendProblem(
    @User() user: IJwtPayload,
    @Query('limit', RecommendationLimitValidatePipe) limit: number,
    @Query('type', RecommendationTypeValidatePipe) type: string,
    @Query('problemId', ProblemIdValidatePipe) problemId: number,
    @Query('company', RecommendationCompanyValidatePipe) company: string,
  ): Promise<ProblemDto[]> {
    if ((problemId || type || company) && !user) {
      throw new UnauthorizedException({
        code: UNAUTHORIZED_USER,
      });
    }
    if (problemId) {
      const check = await this.problemService.checkProblem(problemId);
      if (check) {
        throw new BadRequestException({
          statusCode: 404,
          code: NOT_FOUND_PROBLEM_ID,
        });
      }
    }
    const result = await this.problemService.recommendProblem(
      { limit, type, problemId, company },
      user,
    );

    return result.map((problem) => new ProblemDto(problem));
  }

  @Get('history')
  async getUserHistory(@User() user: IJwtPayload): Promise<SolvedProblemDto[]> {
    const result = await this.problemService.getUserHistory(user);

    return result.map((problem) => new SolvedProblemDto(problem));
  }
  @Get('case/:id')
  async getProblemTestcase(
    @Param('id', ProblemIdValidatePipe) id: number,
  ): Promise<TestcaseDto[]> {
    const check = await this.problemService.checkProblem(id);
    if (check) {
      throw new BadRequestException({
        statusCode: 404,
        code: NOT_FOUND_PROBLEM_ID,
      });
    }
    const result = await this.problemService.getProblemTestcase(id);
    return result;
  }
  @Get('info/:id')
  async getProblemsInfo(
    @Param('id', ProblemIdValidatePipe) id: number,
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
    const { email, provider, desiredCompanies } = initialUserHistoryData;
    this.problemService.postUserData(email, provider, desiredCompanies);
    // this.problemService
    //   .getAllProblems()
    //   .then((problems) => problems.map(({ id: problemId }) => problemId))
    //   .then((problemIds) => {
    //     return this.lambdaService
    //       .invoke({
    //         FunctionName: 'algopa-boj-crawler-2',
    //         InvocationType: 'RequestResponse',
    //         Payload: JSON.stringify({
    //           userId: bojId,
    //           problemIds,
    //           action: 'user_attempt_count',
    //         }),
    //       })
    //       .promise();
    //   })
    //   .then((data) => {
    //     return data;
    //   })
    //   .then((data) => {
    //     const { success, statusCode, result } = JSON.parse(
    //       data.Payload as string,
    //     );
    //     if (!success) {
    //       throw new HttpException(result, statusCode);
    //     }
    //     this.problemService.createSolvedRelations({
    //       email: email,
    //       provider: provider,
    //       attempts: result,
    //     } as ICreateSolvedRelations);
    //   })
    //   .catch((err) => {});
  }
  @Post('history/:id')
  async postUserSolvingHistory(
    @User() user: IJwtPayload,
    @Body() UserSolvingData: UserSolvingHistoryDto,
    @Param('id', ProblemIdValidatePipe) id: number,
  ): Promise<void> {
    const check = await this.problemService.checkProblem(id);
    if (check) {
      throw new BadRequestException({
        statusCode: 404,
        code: NOT_FOUND_PROBLEM_ID,
      });
    }
    this.problemService.postUserSolvingData(UserSolvingData, user, id);
  }
}
