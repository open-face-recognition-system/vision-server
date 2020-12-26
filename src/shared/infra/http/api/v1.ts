import { Request, Response, NextFunction, Router } from 'express';

import usersRouter from '@modules/users/infra/http/routes/users.routes';
import teachersRouter from '@modules/users/infra/http/routes/teachers.routes';
import studentsRouter from '@modules/users/infra/http/routes/students.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import profilesRouter from '@modules/users/infra/http/routes/profiles.routes';
import photosRouter from '@modules/photos/infra/http/routes/photos.routes';
import refreshTokensRouter from '@modules/users/infra/http/routes/refreshTokens.routes';
import validationRouter from '@modules/validation/routes/validation.routes';
import semestersRouter from '@modules/semesters/infra/http/routes/semesters.routes';
import subjectsRouter from '@modules/subjects/infra/http/routes/subjects.routes';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const v1Router = Router();

v1Router.use('/users', usersRouter);
v1Router.use('/teachers', teachersRouter);
v1Router.use('/students', studentsRouter);
v1Router.use('/sessions', sessionsRouter);
v1Router.use('/refresh-tokens', refreshTokensRouter);
v1Router.use('/validation', validationRouter);

v1Router.use((request: Request, response: Response, next: NextFunction) => {
  ensureAuthenticated(['admin'], request, response, next);
});

v1Router.use('/semesters', semestersRouter);
v1Router.use('/subjects', subjectsRouter);

v1Router.use((request: Request, response: Response, next: NextFunction) => {
  ensureAuthenticated(['admin', 'student', 'teacher'], request, response, next);
});

v1Router.use('/profiles', profilesRouter);
v1Router.use('/photos', photosRouter);

export default v1Router;
