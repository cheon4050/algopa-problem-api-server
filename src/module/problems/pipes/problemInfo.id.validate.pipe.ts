import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ProblemInfoIdValidatePipe implements PipeTransform<number> {
  async transform(value: number): Promise<number> {
    if (value) {
      return value;
    } else {
      throw new BadRequestException('INVALID_PROBLEM_ID');
    }
  }
}