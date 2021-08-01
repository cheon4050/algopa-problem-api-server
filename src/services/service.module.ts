import { Module } from '@nestjs/common';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { ProblemsModule } from './problems/problems.module';
@Module({
  imports: [ProblemsModule, HealthcheckModule],
})
export class ServiceModule {}
