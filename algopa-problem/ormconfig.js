require('dotenv').config({ path: 'env/.env.dev.local' });
const { join } = require('path');

const ormConfigOptions = {
  type: process.env.DATABASE_TYPE,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB,
  entities: [join(__dirname, '/dist/**/entities/*.entity.{js,ts}')],
  migrations: [join(__dirname, '/dist/migrations/*.{js,ts}')],
  synchronize: process.env.NODE_ENV === 'dev',
  migrationsRun: true,
  logging: ['warn', 'error'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

module.exports = ormConfigOptions;
