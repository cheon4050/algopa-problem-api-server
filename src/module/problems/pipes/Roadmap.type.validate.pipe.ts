import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class RoadmapTypeValidatePipe
  implements PipeTransform<string, Promise<string>>
{
  async transform(value: string): Promise<string> {
    const validRecommendationTypes = ['kakao', 'samsung'];

    if (!value || validRecommendationTypes.includes(value)) {
      return value;
    } else {
      throw new BadRequestException('INVALID_ROADMAP_TYPE');
    }
  }
}
