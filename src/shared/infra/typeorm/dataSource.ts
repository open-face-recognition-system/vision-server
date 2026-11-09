import 'reflect-metadata';
import path from 'path';
import { DataSource } from 'typeorm';

const root = path.resolve(__dirname, '..', '..', '..');

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [path.join(root, 'modules/**/infra/typeorm/entities/*.{ts,js}')],
  migrations: [path.join(root, 'shared/infra/typeorm/migrations/*.{ts,js}')],
  migrationsRun: true,
});
