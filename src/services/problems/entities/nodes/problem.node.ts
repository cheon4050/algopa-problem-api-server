import { IProblemResponse } from '../../interfaces/response/problem-response.interface';
import { IntegerType } from 'src/services/problems/types/integer.type';
import { IHistory, IProblemNode } from '../../interfaces/node.interface';
import { DateType } from '../../types/date.type';

export class ProblemNode implements IProblemNode {
  id: IntegerType;
  title: string;
  level: IntegerType;
  link: string;

  tryCount?: IntegerType;
  date?: DateType;

  constructor(problem: IProblemNode);
  constructor(problem: IProblemNode & IHistory) {
    this.id = problem.id;
    this.title = problem.title;
    this.level = problem.level;
    this.link = problem.link;

    if (problem.try && problem.date) {
      this.tryCount = problem.try;
      this.date = problem.date;
    }
  }

  toResponseObject(
    nodeId: number,
    isSolved = false,
    include?,
  ): IProblemResponse {
    const { id, title, level, link, tryCount, date } = this;
    const responseObject: IProblemResponse = {
      nodeId,
      number: id.low,
      title,
      level: level.low,
      link,
    };
    if (tryCount && date) {
      responseObject.tryCount = tryCount.low;
      responseObject.date = `${date.year.low}-${date.month.low}-${date.day.low}`;
    }
    if (include) {
      responseObject.isSolved = isSolved;
    }

    return responseObject;
  }
}
