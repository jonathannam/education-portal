import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { DataSource, DataSourceOptions } from 'typeorm';

const env = dotenv.parse(
  fs.readFileSync(`src/env/${process.env.NODE_ENV}.env`),
);
export const typeOrmConfigOptions: TypeOrmModuleOptions & DataSourceOptions = {
  type: 'mysql',
  database: env.DATABASE_NAME,
  username: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  host: env.DATABASE_HOST,
  port: +env.DATABASE_PORT,
  entities: ['dist/app/entities/*.js'],
  migrations: ['dist/app/migrations/*.js'],
  migrationsRun: true,
};

export default new DataSource(typeOrmConfigOptions);
