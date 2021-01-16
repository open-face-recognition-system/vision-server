import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import SubjectsController from '../controllers/SubjectsController';
import EnrollStudentController from '../controllers/EnrollStudentController';
import UnenrollStudentController from '../controllers/UnenrollStudentController';
import SubjectsTeacherController from '../controllers/SubjectsTeacherController';

const subjectsRouter = Router();
const subjectsController = new SubjectsController();
const enrollStudentController = new EnrollStudentController();
const unenrollStudentController = new UnenrollStudentController();
const subjectsTeacherController = new SubjectsTeacherController();

subjectsRouter.get('/', subjectsController.list);
subjectsRouter.get('/:id', subjectsController.show);
subjectsRouter.post(
  '/:id/enroll',
  celebrate({
    [Segments.BODY]: {
      studentId: Joi.number().required(),
    },
  }),
  enrollStudentController.create,
);
subjectsRouter.post(
  '/:id/unenroll',
  celebrate({
    [Segments.BODY]: {
      studentId: Joi.number().required(),
    },
  }),
  unenrollStudentController.create,
);
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
subjectsRouter.get('/teacher/:teacherId', subjectsTeacherController.list);

export default subjectsRouter;
