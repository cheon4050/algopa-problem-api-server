export interface ICreateSolvedRelations {
  email: string;
  provider: string;
  attempts: [
    {
      problemId: string;
      attemptCount: number;
      time: string;
    },
  ];
}
