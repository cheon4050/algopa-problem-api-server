import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class RecommendationLimitValidatePipe implements PipeTransform<number> {
  async transform(value: number): Promise<number> {
    if (!value) {
      value = 20;
    }
    return value;
  }
}
