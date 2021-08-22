import { CategoryDto } from '../../dto/category.dto';
import { ICategoryProperty } from '../../interfaces/node.interface';
import { IntegerType } from '../../types/integer.type';

export class CategoryNode implements ICategoryProperty {
  name: string;
  order: IntegerType;

  constructor(category: ICategoryProperty) {
    this.name = category.name;
    this.order = category.order;
  }

  toResponseObject(
    nodeId,
    problemCount,
    failureRate?,
    progressRate?,
    solvedCount?,
  ): CategoryDto {
    const { name, order } = this;

    const responseObject: CategoryDto = {
      nodeId,
      name,
      order: order.low,
      problemCount: problemCount,
    };

    if (failureRate !== undefined) {
      responseObject.failureRate = failureRate;
    }

    if (progressRate !== undefined) {
      responseObject.progressRate = progressRate;
    }
    if (solvedCount !== undefined) {
      responseObject.solvedCount = solvedCount;
    }

    return responseObject;
  }
}
