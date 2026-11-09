import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';
import RecognitionController from '../controllers/RecognitionController';
import authorize, { STAFF } from '@shared/infra/http/middlewares/authorize';
import Role from '@modules/users/infra/typeorm/entities/Role';

const upload = multer(uploadConfig.multer);

const recognitionRouter = Router();
const recognitionController = new RecognitionController();

recognitionRouter.post(
  '/recognize/:classId', authorize(Role.TEACHER),
  upload.single('file'),
  recognitionController.recognize,
);

recognitionRouter.post('/training/:subjectId', authorize(...STAFF), recognitionController.training);

recognitionRouter.post(
  '/update/:classId/student/:studentId', authorize(Role.TEACHER),
  upload.single('file'),
  recognitionController.update,
);
export default recognitionRouter;
