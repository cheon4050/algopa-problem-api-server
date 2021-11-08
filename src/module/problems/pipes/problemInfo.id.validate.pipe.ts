import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ProblemIdValidatePipe implements PipeTransform<number> {
  async transform(value: number): Promise<number> {
    if (value) {
      return value;
    } else {
      return undefined;
    }
  }
}
