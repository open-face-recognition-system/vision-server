import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ClassesController from '../controllers/ClassesController';

const classesRouter = Router();
const classesController = new ClassesController();

classesRouter.get('/', classesController.list);
classesRouter.get('/:id', classesController.show);
classesRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      startHour: Joi.date().required(),
      endHour: Joi.date().required(),
      date: Joi.date().required(),
      subjectId: Joi.number().required(),
      semesterId: Joi.number().required(),
    },
  }),
  classesController.create,
);
classesRouter.put(
  '/:id',
  celebrate({
    [Segments.BODY]: {
      startHour: Joi.date().required(),
      endHour: Joi.date().required(),
      date: Joi.date().required(),
      subjectId: Joi.number().required(),
      semesterId: Joi.number().required(),
    },
  }),
  classesController.update,
);
classesRouter.delete('/:id', classesController.delete);

export default classesRouter;
