import { registerAs } from '@nestjs/config';

export default registerAs('sentry', () => ({
  dsn: process.env.PROBLEM_SENTRY_DSN,
  env: process.env.PROBLEM_SENTRY_ENV,
}));
