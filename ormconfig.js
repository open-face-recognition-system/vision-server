
const {
  DB_HOST = 'postgres',
  DB_PORT = '5432',
  DB_USER = 'postgres',
  DB_PASS = 'postgres',
  DB_NAME = 'face_recognizer',
} = process.env;

module.exports = {
  type: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  entities: [
    process.env.NODE_ENV === 'production'
      ? 'dist/modules/**/infra/typeorm/entities/*.js'
      : 'src/modules/**/infra/typeorm/entities/*.ts'
  ],
  migrations: [
    process.env.NODE_ENV === 'production'
      ? 'dist/shared/infra/typeorm/migrations/*.js'
      : 'src/shared/infra/typeorm/migrations/*.ts'
  ],
  cli: {
    migrationsDir: 'src/shared/infra/typeorm/migrations'
  },
  seeds: [
    process.env.NODE_ENV === 'production'
      ? 'dist/shared/infra/typeorm/seeds/**/*.{js}'
      : 'src/shared/infra/typeorm/seeds/**/*.{ts,js}'
  ],
  factories: [
    process.env.NODE_ENV === 'production'
      ? 'dist/shared/infra/typeorm/factories/**/*.{js}'
      : 'src/shared/infra/typeorm/factories/**/*.{ts,js}'
  ]
};
