import { EdgeDto } from '../../dto/edge.dto';
import { IEdgeRelationship } from '../../interfaces/edge-relationship.interface';
import { IntegerType } from '../../types/integer.type';

export class Edge implements IEdgeRelationship {
  start: IntegerType;
  end: IntegerType;
  type: 'next' | 'in' | 'Solved';

  constructor({ start, end, type }: IEdgeRelationship) {
    this.start = start;
    this.end = end;
    this.type = type;
  }

  toResponseObject(): EdgeDto {
    const { start, end, type } = this;

    const responseObject: EdgeDto = {
      from: start.low,
      to: end.low,
      type,
    };

    return responseObject;
  }
}
