import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import RefreshTokenController from '../controllers/RefreshTokenController';

const refreshTokensRouter = Router();
const refreshTokenController = new RefreshTokenController();

refreshTokensRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      refreshToken: Joi.string().allow(null, ''),
    },
  }),
  refreshTokenController.create,
);

export default refreshTokensRouter;
