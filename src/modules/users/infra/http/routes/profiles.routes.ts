import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import StudentProfileController from '../controllers/StudentProfileController';
import TeacherProfileController from '../controllers/TeacherProfileController';

const profilesRouter = Router();
const studentProfileController = new StudentProfileController();
const teacherProfileController = new TeacherProfileController();

profilesRouter.get('/', studentProfileController.show);
profilesRouter.put(
  '/:id/student',
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
  '/:id/teacher',
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

export default profilesRouter;
