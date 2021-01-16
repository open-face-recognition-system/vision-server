import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';
import RecognizeController from '../controllers/RecognizeController';

const upload = multer(uploadConfig.multer);

const recognizeRouter = Router();
const recognizeController = new RecognizeController();

recognizeRouter.post(
  '/:classId',
  upload.single('file'),
  recognizeController.create,
);

export default recognizeRouter;
