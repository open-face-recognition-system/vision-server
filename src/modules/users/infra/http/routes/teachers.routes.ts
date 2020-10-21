import { Router } from 'express';

import { celebrate, Segments, Joi } from 'celebrate';

import TeachersController from '../controllers/TeachersController';

const teachersRouter = Router();
const teachersController = new TeachersController();

teachersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      enrollment: Joi.string().required(),
      userId: Joi.number().required(),
    },
  }),
  teachersController.create,
);

export default teachersRouter;