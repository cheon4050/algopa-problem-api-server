import { registerAs } from '@nestjs/config';

export default registerAs('neo4j', () => ({
  scheme: process.env.DATABASE_SCHEME,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_DB,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
}));
