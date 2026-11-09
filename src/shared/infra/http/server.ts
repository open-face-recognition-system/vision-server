import 'reflect-metadata';
import fs from 'fs';
import { container } from 'tsyringe';
import uploadConfig from '@config/upload';
import dataSource from '@shared/infra/typeorm/dataSource';
import EnsureAdminService from '@modules/users/services/EnsureAdminService';
import app from './app';

const REQUIRED_ENV = ['APP_SECRET', 'APP_URL', 'DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME'];

const missing = REQUIRED_ENV.filter(name => !process.env[name]);
if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

[uploadConfig.tmpFolder, uploadConfig.uploadsFolder, uploadConfig.recognitionFilesFolder].forEach(folder =>
  fs.mkdirSync(folder, { recursive: true }),
);

const port = Number(process.env.PORT || 3333);
const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

dataSource
  .initialize()
  .then(async () => {
    if (ADMIN_EMAIL && ADMIN_PASSWORD) {
      await container.resolve(EnsureAdminService).execute({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    }
  })
  .then(() => app.listen(port, () => console.log(`Server listening on port ${port}`)));
