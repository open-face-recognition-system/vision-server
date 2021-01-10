import { Router } from 'express';
import TrainingController from '../controllers/TrainingController';

const trainingRouter = Router();
const trainingController = new TrainingController();

trainingRouter.post('/:subjectId', trainingController.create);

export default trainingRouter;
