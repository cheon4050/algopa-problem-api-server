import { IsNotEmpty, IsString } from 'class-validator';
import { ITestcase } from '../interfaces/problem-testcase.interface';

export class TestcaseDto implements ITestcase {
  constructor(testcase: ITestcase) {
    this.input = testcase.input;
    this.answer = testcase.answer;
  }

  @IsString({ each: true })
  @IsNotEmpty()
  input: string[];

  @IsString({ each: true })
  @IsNotEmpty()
  answer: string[];
}
