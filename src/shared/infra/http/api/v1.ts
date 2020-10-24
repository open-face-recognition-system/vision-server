import { Request, Response, NextFunction, Router } from 'express';

import usersRouter from '@modules/users/infra/http/routes/users.routes';
import teachersRouter from '@modules/users/infra/http/routes/teachers.routes';
import studentsRouter from '@modules/users/infra/http/routes/students.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import profilesRouter from '@modules/users/infra/http/routes/profiles.routes';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const v1Router = Router();

v1Router.use('/users', usersRouter);
v1Router.use('/teachers', teachersRouter);
v1Router.use('/students', studentsRouter);
v1Router.use('/sessions', sessionsRouter);

v1Router.use((request: Request, response: Response, next: NextFunction) => {
  ensureAuthenticated(['admin', 'student', 'teacher'], request, response, next);
});

v1Router.use('/profiles', profilesRouter);

export default v1Router;
