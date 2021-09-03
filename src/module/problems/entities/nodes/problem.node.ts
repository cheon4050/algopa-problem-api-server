import {
  IProblem,
  IRoadmapProblem,
  ISolvedProblem,
} from '../../interfaces/problem.interface';
import { IProblemProperty } from '../../interfaces/node.interface';
import { DateType } from '../../types/date.type';
import { IntegerType } from '../../types/integer.type';
import { ISolvedEdge } from '../../interfaces/edge-relationship.interface';

export class ProblemNode implements IProblemProperty {
  id: IntegerType;
  title: string;
  level: IntegerType;
  link: string;

  tryCount?: IntegerType;
  date?: DateType;

  constructor(problem: IProblemProperty);
  constructor(problem: IProblemProperty & ISolvedEdge) {
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
    categories?,
  ): IProblem | ISolvedProblem | IRoadmapProblem {
    const { id, title, level, link, tryCount, date } = this;
    const responseObject: IProblem | ISolvedProblem | IRoadmapProblem = {
      nodeId,
      id: id.low,
      title,
      level: level.low,
      link,
    };
    if (categories) {
      responseObject.categories = categories;
    }
    if (tryCount !== undefined && date) {
      (responseObject as ISolvedProblem).tryCount =
        typeof tryCount === 'object' ? tryCount.low : (tryCount as number);
      (
        responseObject as ISolvedProblem
      ).date = `${date.year.low}-${date.month.low}-${date.day.low}`;
    }
    if (include) {
      (responseObject as IRoadmapProblem).isSolved = isSolved;
    }
    return responseObject;
  }
}
