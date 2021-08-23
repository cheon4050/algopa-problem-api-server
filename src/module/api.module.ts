import { Module } from '@nestjs/common';
import { ProblemsModule } from './problems/problems.module';
@Module({
  imports: [ProblemsModule],
})
export class ApiModule {}
