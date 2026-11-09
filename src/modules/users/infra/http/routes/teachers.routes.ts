import { Router } from 'express';

import { celebrate, Segments, Joi } from 'celebrate';

import TeachersController from '../controllers/TeachersController';
import authorize from '@shared/infra/http/middlewares/authorize';
import Role from '@modules/users/infra/typeorm/entities/Role';

const teachersRouter = Router();
const teachersController = new TeachersController();

teachersRouter.get('/', authorize(Role.ADMIN), teachersController.list);
teachersRouter.get('/:id', authorize(Role.ADMIN), teachersController.show);
teachersRouter.post(
  '/', authorize(Role.ADMIN),
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email({ tlds: false }).required(),
      password: Joi.string().min(6).required(),
      enrollment: Joi.string().required(),
    },
  }),
  teachersController.create,
);
teachersRouter.put(
  '/:id', authorize(Role.ADMIN),
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().required(),
    },
  }),
  teachersController.update,
);

export default teachersRouter;
