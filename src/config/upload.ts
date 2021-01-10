import path from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 'do' | 'disk';
  tmpFolder: string;
  uploadsFolder: string;
  recognitionFilesFolder: string;
  multer: {
    storage: StorageEngine;
  };
  config: {
    do: {
      endpoint: string;
      bucket: string;
      recognitionBucket: string;
      region: string;
      accessKeyId: string;
      secretAccessKey: string;
    };
  };
}

export default {
  driver: process.env.STORAGE_DRIVER,
  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),
  recognitionFilesFolder: path.resolve(tmpFolder, 'recognitionFiles'),
  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('hex');
        const fileName = `${fileHash}-${file.originalname.trim()}`;

        return callback(null, fileName);
      },
    }),
  },
  config: {
    do: {
      endpoint: process.env.DO_ENDPOINT,
      bucket: process.env.DO_BUCKET,
      recognitionBucket: process.env.DO_RECOGNITION_BUCKET,
      region: process.env.DO_DEFAULT_REGION,
      accessKeyId: process.env.DO_ACCESS_KEY_ID,
      secretAccessKey: process.env.DO_SECRET_ACCESS_KEY,
    },
  },
} as IUploadConfig;
