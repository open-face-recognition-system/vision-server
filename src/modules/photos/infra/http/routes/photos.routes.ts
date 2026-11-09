import { Router } from 'express';

import multer from 'multer';
import uploadConfig from '@config/upload';

import StudentPhotosController from '../controllers/StudentPhotosController';
import authorize from '@shared/infra/http/middlewares/authorize';
import Role from '@modules/users/infra/typeorm/entities/Role';

const upload = multer(uploadConfig.multer);

const photosRouter = Router();
const studentPhotosController = new StudentPhotosController();

photosRouter.get('/', authorize(Role.STUDENT), studentPhotosController.show);
photosRouter.post('/', authorize(Role.STUDENT), upload.single('file'), studentPhotosController.create);
photosRouter.put('/:id', authorize(Role.STUDENT), upload.single('file'), studentPhotosController.update);
photosRouter.delete('/:id', authorize(Role.STUDENT), studentPhotosController.delete);

export default photosRouter;
