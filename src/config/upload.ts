import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const storageFolder = path.resolve(process.env.STORAGE_DIR || 'storage');
const tmpFolder = path.join(storageFolder, 'tmp');

export default {
  tmpFolder,
  uploadsFolder: path.join(storageFolder, 'uploads'),
  recognitionFilesFolder: path.join(storageFolder, 'classifiers'),
  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('hex');
        callback(null, `${fileHash}-${path.basename(file.originalname.trim())}`);
      },
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
  },
};
