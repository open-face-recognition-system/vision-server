import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import AttendancesController from '../controllers/AttendancesController';
import AttendancesClassController from '../controllers/AttendancesClassController';
import authorize, { STAFF } from '@shared/infra/http/middlewares/authorize';
import Role from '@modules/users/infra/typeorm/entities/Role';

const attendancesRouter = Router();
const attendancesController = new AttendancesController();
const attendancesClassController = new AttendancesClassController();

attendancesRouter.get('/', authorize(...STAFF), attendancesController.list);
attendancesRouter.get('/:id', authorize(...STAFF), attendancesController.show);
attendancesRouter.get('/class/:classId', authorize(...STAFF), attendancesClassController.list);
attendancesRouter.post(
  '/', authorize(Role.ADMIN),
  celebrate({
    [Segments.BODY]: {
      isPresent: Joi.boolean().required(),
      classId: Joi.number().required(),
      studentId: Joi.number().required(),
    },
  }),
  attendancesController.create,
);
attendancesRouter.put(
  '/:id', authorize(...STAFF),
  celebrate({
    [Segments.BODY]: {
      isPresent: Joi.boolean().required(),
      classId: Joi.number().required(),
      studentId: Joi.number().required(),
    },
  }),
  attendancesController.update,
);
attendancesRouter.delete('/:id', authorize(Role.ADMIN), attendancesController.delete);

export default attendancesRouter;
