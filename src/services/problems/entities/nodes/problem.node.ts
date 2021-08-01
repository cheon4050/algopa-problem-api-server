import { IProblemResponse } from '../../interfaces/response/problem-response.interface';
import { IProblem } from '../../interfaces/problem.interface';
import { IntegerType } from 'src/services/problems/types/integer.type';

export class ProblemNode implements IProblem {
  id: IntegerType;
  title: string;
  level: IntegerType;
  link: string;

  constructor({ id, title, level, link }: IProblem) {
    this.id = id;
    this.title = title;
    this.level = level;
    this.link = link;
  }

  toResponseObject(
    nodeId: number,
    isSolved = false,
    include?,
  ): IProblemResponse {
    const { id, title, level, link } = this;
    const responseObject: IProblemResponse = {
      nodeId,
      number: id.low,
      title,
      level: level.low,
      link,
    };
    if (include) {
      responseObject.isSolved = isSolved;
    }

    return responseObject;
  }
}
