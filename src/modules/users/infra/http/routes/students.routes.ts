import { Router } from 'express';

import { celebrate, Segments, Joi } from 'celebrate';

import StudentsController from '../controllers/StudentsController';
import authorize from '@shared/infra/http/middlewares/authorize';
import Role from '@modules/users/infra/typeorm/entities/Role';

const studentsRouter = Router();
const studentsController = new StudentsController();

studentsRouter.get('/', authorize(Role.ADMIN), studentsController.list);
studentsRouter.get('/:id', authorize(Role.ADMIN), studentsController.show);
studentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email({ tlds: false }).required(),
      password: Joi.string().min(6).required(),
      enrollment: Joi.string().required(),
    },
  }),
  studentsController.create,
);
studentsRouter.put(
  '/:id', authorize(Role.ADMIN),
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().required(),
    },
  }),
  studentsController.update,
);

export default studentsRouter;
