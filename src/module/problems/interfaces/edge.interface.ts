export interface IEdge {
  type: 'next' | 'main_tag' | 'solved';
  from: number;
  to: number;
}
