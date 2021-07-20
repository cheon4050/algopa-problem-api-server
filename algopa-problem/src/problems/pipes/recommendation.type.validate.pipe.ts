import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class RecommendationTypeValidatePipe
  implements PipeTransform<string, Promise<string>>
{
  async transform(value: string): Promise<string> {
    const validRecommendationTypes = ['less', 'next', 'wrong'];

    if (!value || validRecommendationTypes.includes(value)) {
      return value;
    } else {
      throw new BadRequestException('INVALID_RECOMMEND_TYPE');
    }
  }
}
[];
