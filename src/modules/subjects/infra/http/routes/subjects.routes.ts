import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import multer from 'multer';
import uploadConfig from '@config/upload';
import SubjectsController from '../controllers/SubjectsController';
import EnrollStudentController from '../controllers/EnrollStudentController';
import UnenrollStudentController from '../controllers/UnenrollStudentController';
import SubjectsTeacherController from '../controllers/SubjectsTeacherController';
import EnrollStudentPdfController from '../controllers/EnrollStudentPdfController';
import authorize, { STAFF } from '@shared/infra/http/middlewares/authorize';
import Role from '@modules/users/infra/typeorm/entities/Role';

const subjectsRouter = Router();
const subjectsController = new SubjectsController();
const enrollStudentController = new EnrollStudentController();
const enrollStudentPdfController = new EnrollStudentPdfController();
const unenrollStudentController = new UnenrollStudentController();
const subjectsTeacherController = new SubjectsTeacherController();

const upload = multer(uploadConfig.multer);

subjectsRouter.get('/', authorize(...STAFF), subjectsController.list);
subjectsRouter.get('/:id', authorize(...STAFF), subjectsController.show);
subjectsRouter.post(
  '/:id/enroll', authorize(Role.ADMIN),
  celebrate({
    [Segments.BODY]: {
      studentId: Joi.number().required(),
    },
  }),
  enrollStudentController.create,
);
subjectsRouter.post(
  '/:id/enroll/pdf', authorize(Role.ADMIN),
  upload.single('file'),
  enrollStudentPdfController.create,
);
subjectsRouter.post(
  '/:id/unenroll', authorize(Role.ADMIN),
  celebrate({
    [Segments.BODY]: {
      studentId: Joi.number().required(),
    },
  }),
  unenrollStudentController.create,
);
subjectsRouter.post(
  '/', authorize(Role.ADMIN),
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
  '/:id', authorize(Role.ADMIN),
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
subjectsRouter.delete('/:id', authorize(Role.ADMIN), subjectsController.delete);
subjectsRouter.get('/teacher/:teacherId', authorize(Role.ADMIN), subjectsTeacherController.list);

export default subjectsRouter;
