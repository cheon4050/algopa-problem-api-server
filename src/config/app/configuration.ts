import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  node: process.env.NODE_ENV,
  port: process.env.PROBLEM_APP_PORT,
  webDomain: process.env.WEB_DOMAIN,
  prettyLogPrint: process.env.PRETTY_LOG_PRINT,
}));
