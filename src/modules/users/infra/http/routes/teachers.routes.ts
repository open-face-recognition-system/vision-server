import { Router } from 'express';

import { celebrate, Segments, Joi } from 'celebrate';

import TeachersController from '../controllers/TeachersController';

const teachersRouter = Router();
const teachersController = new TeachersController();

teachersRouter.get('/', teachersController.list);
teachersRouter.get('/:id', teachersController.show);
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
teachersRouter.put(
  '/:id',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().required(),
    },
  }),
  teachersController.update,
);

export default teachersRouter;
