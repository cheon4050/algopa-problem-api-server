import { registerAs } from '@nestjs/config';

export default registerAs('neo4j', () => ({
  scheme: process.env.NEO4J_SCHEME,
  host: process.env.NEO4J_HOST,
  port: process.env.NEO4J_PORT,
  database: process.env.NEO4J_DATABASE,
  username: process.env.NEO4J_USERNAME,
  password: process.env.NEO4J_PASSWORD,
}));
