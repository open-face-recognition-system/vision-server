import { Router } from 'express';

import usersRouter from '@modules/users/infra/http/routes/users.routes';

const v1Router = Router();

v1Router.use('/users', usersRouter);

export default v1Router;
