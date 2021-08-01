import { IEdge } from 'src/services/problems/interfaces/edge.interface';
import { IntegerType } from 'src/services/problems/types/integer.type';
import { IEdgeResponse } from 'src/services/problems/interfaces/response/edge-response.interface';

export class Edge implements IEdge {
  start: IntegerType;
  end: IntegerType;
  type: 'next' | 'in';

  constructor({ start, end, type }: IEdge) {
    this.start = start;
    this.end = end;
    this.type = type;
  }

  toResponseObject(): IEdgeResponse {
    const { start, end, type } = this;

    const responseObject: IEdgeResponse = {
      from: start.low,
      to: end.low,
      type,
    };

    return responseObject;
  }
}
