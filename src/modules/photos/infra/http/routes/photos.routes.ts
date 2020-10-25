import { Router } from 'express';

import multer from 'multer';
import uploadConfig from '@config/upload';

import PhotosController from '../controllers/PhotosController';

const upload = multer(uploadConfig);

const photosRouter = Router();
const photosController = new PhotosController();

photosRouter.post('/', upload.single('file'), photosController.create);
photosRouter.put('/:id', upload.single('file'), photosController.update);
photosRouter.delete('/:id', photosController.delete);

export default photosRouter;
