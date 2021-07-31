export class ProblemEntity {
  constructor(
    private readonly problem_id: number,
    private readonly name: string,
    private readonly level: number,
    private readonly site: string,
  ) {}

  toJson(): Record<string, any> {
    return {
      problem_id: this.problem_id,
      name: this.name,
      level: this.level,
      site: this.site,
    };
  }
}
