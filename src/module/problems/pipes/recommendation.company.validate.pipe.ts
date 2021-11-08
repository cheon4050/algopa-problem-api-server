import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class RecommendationCompanyValidatePipe
  implements PipeTransform<string, Promise<string>>
{
  async transform(value: string): Promise<string> {
    const validRecommendationCompanies = ['kakao', 'samsung'];

    if (!value || validRecommendationCompanies.includes(value)) {
      return value;
    } else {
      throw new BadRequestException('INVALID_RECOMMEND_COMPANY');
    }
  }
}
