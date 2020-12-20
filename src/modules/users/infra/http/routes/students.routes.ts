import { Router } from 'express';

import { celebrate, Segments, Joi } from 'celebrate';

import StudentsController from '../controllers/StudentsController';

const studentsRouter = Router();
const studentsController = new StudentsController();

studentsRouter.get('/', studentsController.list);
studentsRouter.get('/:id', studentsController.show);
studentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      enrollment: Joi.string().required(),
      userId: Joi.number().required(),
    },
  }),
  studentsController.create,
);

export default studentsRouter;
