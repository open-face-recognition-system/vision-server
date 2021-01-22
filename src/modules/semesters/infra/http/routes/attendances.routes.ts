import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import AttendancesController from '../controllers/AttendancesController';
import AttendancesClassController from '../controllers/AttendancesClassController';

const attendancesRouter = Router();
const attendancesController = new AttendancesController();
const attendancesClassController = new AttendancesClassController();

attendancesRouter.get('/', attendancesController.list);
attendancesRouter.get('/:id', attendancesController.show);
attendancesRouter.get('/class/:classId', attendancesClassController.list);
attendancesRouter.post(
  '/',
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
  '/:id',
  celebrate({
    [Segments.BODY]: {
      isPresent: Joi.boolean().required(),
      classId: Joi.number().required(),
      studentId: Joi.number().required(),
    },
  }),
  attendancesController.update,
);
attendancesRouter.delete('/:id', attendancesController.delete);

export default attendancesRouter;
