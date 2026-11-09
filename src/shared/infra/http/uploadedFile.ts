import { Request } from 'express';
import AppError from '@shared/errors/AppError';

export default function uploadedFile(request: Request): string {
  if (!request.file) {
    throw new AppError('File is required');
  }

  return request.file.filename;
}
