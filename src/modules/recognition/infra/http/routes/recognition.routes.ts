import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';
import RecognitionController from '../controllers/RecognitionController';

const upload = multer(uploadConfig.multer);

const recognitionRouter = Router();
const recognitionController = new RecognitionController();

recognitionRouter.post(
  '/recognize/:classId',
  upload.single('file'),
  recognitionController.recognize,
);

recognitionRouter.post('/training/:subjectId', recognitionController.training);

recognitionRouter.post(
  '/update/:classId/student/:studentId',
  upload.single('file'),
  recognitionController.update,
);
export default recognitionRouter;
