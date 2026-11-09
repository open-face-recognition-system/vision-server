import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import StudentProfileController from '../controllers/StudentProfileController';
import TeacherProfileController from '../controllers/TeacherProfileController';
import authorize from '@shared/infra/http/middlewares/authorize';
import Role from '@modules/users/infra/typeorm/entities/Role';

const profilesRouter = Router();
const studentProfileController = new StudentProfileController();
const teacherProfileController = new TeacherProfileController();

profilesRouter.get('/', authorize(Role.STUDENT), studentProfileController.show);

profilesRouter.put(
  '/:id/student', authorize(Role.ADMIN),
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().required(),
      oldPassword: Joi.string(),
      password: Joi.string(),
      passwordConfirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  studentProfileController.update,
);
profilesRouter.put(
  '/:id/teacher', authorize(Role.ADMIN),
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().required(),
      oldPassword: Joi.string(),
      password: Joi.string(),
      passwordConfirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  teacherProfileController.update,
);
profilesRouter.put(
  '/student', authorize(Role.STUDENT),
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().required(),
      oldPassword: Joi.string(),
      password: Joi.string(),
      passwordConfirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  studentProfileController.update,
);

export default profilesRouter;
