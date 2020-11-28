import { Router } from 'express';

import multer from 'multer';
import uploadConfig from '@config/upload';

import StudentPhotosController from '../controllers/StudentPhotosController';

const upload = multer(uploadConfig.multer);

const photosRouter = Router();
const studentPhotosController = new StudentPhotosController();

photosRouter.get('/', studentPhotosController.show);
photosRouter.post('/', upload.single('file'), studentPhotosController.create);
photosRouter.put('/:id', upload.single('file'), studentPhotosController.update);
photosRouter.delete('/:id', studentPhotosController.delete);

export default photosRouter;
