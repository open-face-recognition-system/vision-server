import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import SubjectsController from '../controllers/SubjectsController';

const subjectsRouter = Router();
const subjectsController = new SubjectsController();

subjectsRouter.get('/', subjectsController.list);
subjectsRouter.get('/:id', subjectsController.show);
subjectsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      description: Joi.string().required(),
      course: Joi.string().required(),
      teacherId: Joi.number().required(),
    },
  }),
  subjectsController.create,
);
subjectsRouter.put(
  '/:id',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      description: Joi.string().required(),
      course: Joi.string().required(),
      teacherId: Joi.number().required(),
    },
  }),
  subjectsController.update,
);
subjectsRouter.delete('/:id', subjectsController.delete);

export default subjectsRouter;
