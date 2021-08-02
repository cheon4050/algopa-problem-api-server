import { ICategoryNode } from '../../interfaces/node.interface';
import { ICategoryResponse } from '../../interfaces/response/category-response.interface';
import { IntegerType } from '../../types/integer.type';

export class CategoryNode implements ICategoryNode {
  name: string;
  order: IntegerType;

  constructor(category: ICategoryNode) {
    this.name = category.name;
    this.order = category.order;
  }

  toResponseObject(nodeId, failureRate?, progressRate?): ICategoryResponse {
    const { name, order } = this;

    const responseObject: ICategoryResponse = {
      nodeId,
      name,
      order: order.low,
    };

    if (failureRate !== undefined) {
      responseObject.failureRate = failureRate;
    }

    if (progressRate !== undefined) {
      responseObject.progressRate = progressRate;
    }

    return responseObject;
  }
}
