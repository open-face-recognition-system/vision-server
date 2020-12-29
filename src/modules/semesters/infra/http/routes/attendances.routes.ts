import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import AttendancesController from '../controllers/AttendancesController';

const attendancesRouter = Router();
const attendancesController = new AttendancesController();

attendancesRouter.get('/', attendancesController.list);
attendancesRouter.get('/:id', attendancesController.show);
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
