import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  node: process.env.NODE_ENV,
  port: process.env.APP_PORT,
  prettyLogPrint: process.env.PRETTY_LOG_PRINT,
}));
