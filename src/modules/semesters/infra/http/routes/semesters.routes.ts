import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import SemestersController from '../controllers/SemestersController';
import authorize, { STAFF } from '@shared/infra/http/middlewares/authorize';
import Role from '@modules/users/infra/typeorm/entities/Role';

const semestersRouter = Router();
const semestersController = new SemestersController();

semestersRouter.get('/', authorize(...STAFF), semestersController.list);
semestersRouter.get('/:id', authorize(...STAFF), semestersController.show);
semestersRouter.post(
  '/', authorize(Role.ADMIN),
  celebrate({
    [Segments.BODY]: {
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
    },
  }),
  semestersController.create,
);
semestersRouter.put(
  '/:id', authorize(Role.ADMIN),
  celebrate({
    [Segments.BODY]: {
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
    },
  }),
  semestersController.update,
);
semestersRouter.delete('/:id', authorize(Role.ADMIN), semestersController.delete);

export default semestersRouter;
