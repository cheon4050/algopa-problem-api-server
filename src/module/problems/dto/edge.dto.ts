import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IEdge } from '../interfaces/edge.interface';

export class EdgeDto implements IEdge {
  constructor(edge: IEdge) {
    this.from = edge.from;
    this.to = edge.to;
    this.type = edge.type;
  }
  @IsNumber()
  @IsNotEmpty()
  from: number;

  @IsNumber()
  @IsNotEmpty()
  to: number;

  @IsString()
  @IsNotEmpty()
  type: 'next' | 'main_tag' | 'solved';
}
