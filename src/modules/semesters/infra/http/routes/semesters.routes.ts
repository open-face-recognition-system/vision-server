import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import SemestersController from '../controllers/SemestersController';

const semestersRouter = Router();
const semestersController = new SemestersController();

semestersRouter.get('/', semestersController.list);
semestersRouter.get('/:id', semestersController.show);
semestersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
    },
  }),
  semestersController.create,
);
semestersRouter.put(
  '/:id',
  celebrate({
    [Segments.BODY]: {
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
    },
  }),
  semestersController.update,
);
semestersRouter.delete('/:id', semestersController.delete);

export default semestersRouter;
