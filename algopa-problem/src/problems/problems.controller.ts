import { Controller } from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { VersionGet } from '../common/decorators/version-get.decorator';
import { UserId } from '../common/decorators/user-id.decorator';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @VersionGet({ path: 'roadmap', version: 'v1' })
  async getRoadMap(@UserId() userId: number) {
    return await this.problemsService.getRoadMap(userId);
  }
}
