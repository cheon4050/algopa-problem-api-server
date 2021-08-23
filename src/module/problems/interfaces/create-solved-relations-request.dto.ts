import { IProblemAttempt } from './problem-attempt.interface';

export class ICreateSolvedRelations {
  email: string;
  provider: string;
  attempts: IProblemAttempt[];
}
