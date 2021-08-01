import { ICategoryNode } from '../../interfaces/node.interface';
import { ICategoryResponse } from '../../interfaces/response/category-response.interface';

export class CategoryNode implements ICategoryNode {
  name: string;

  constructor({ name }: ICategoryNode) {
    this.name = name;
  }

  toResponseObject(nodeId, failureRate?, progressRate?): ICategoryResponse {
    const { name } = this;

    const responseObject: ICategoryResponse = {
      nodeId,
      name,
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
