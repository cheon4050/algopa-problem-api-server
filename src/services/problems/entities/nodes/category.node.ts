import { ICategory } from '../../interfaces/category.interface';
import { ICategoryResponse } from '../../interfaces/response/category-response.interface';

export class CategoryNode implements ICategory {
  name: string;

  constructor({ name }: ICategory) {
    this.name = name;
  }

  toResponseObject(nodeId, failureRate?, progressRate?): ICategoryResponse {
    const { name } = this;

    const responseObject: ICategoryResponse = {
      nodeId,
      name,
    };

    if (failureRate) {
      responseObject.failureRate = failureRate;
    }

    if (progressRate) {
      responseObject.progressRate = progressRate;
    }

    return responseObject;
  }
}
