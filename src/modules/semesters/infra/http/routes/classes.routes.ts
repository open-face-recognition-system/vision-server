import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ClassesController from '../controllers/ClassesController';
import ClassesTeacherController from '../controllers/ClassesTeacherController';
import authorize, { STAFF } from '@shared/infra/http/middlewares/authorize';
import Role from '@modules/users/infra/typeorm/entities/Role';

const classesRouter = Router();
const classesController = new ClassesController();
const classesTeacherController = new ClassesTeacherController();

classesRouter.get('/', authorize(...STAFF), classesController.list);
classesRouter.get('/:id', authorize(...STAFF), classesController.show);
classesRouter.post(
  '/', authorize(Role.ADMIN),
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
  '/:id', authorize(Role.ADMIN),
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
classesRouter.delete('/:id', authorize(Role.ADMIN), classesController.delete);
classesRouter.get(
  '/teacher/classes/mobile', authorize(Role.TEACHER),
  classesTeacherController.listMobile,
);
classesRouter.get('/teacher/:teacherId', authorize(Role.ADMIN), classesTeacherController.list);

export default classesRouter;
