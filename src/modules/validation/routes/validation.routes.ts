import { Router } from 'express';
import ValidationController from '../controllers/ValidationController';

const validationRouter = Router();
const validationController = new ValidationController();

validationRouter.post('/training', validationController.training);
validationRouter.post('/recognize', validationController.recognize);

export default validationRouter;
