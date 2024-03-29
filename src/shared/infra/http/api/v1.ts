import { Request, Response, NextFunction, Router } from 'express';

import usersRouter from '@modules/users/infra/http/routes/users.routes';
import teachersRouter from '@modules/users/infra/http/routes/teachers.routes';
import studentsRouter from '@modules/users/infra/http/routes/students.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import profilesRouter from '@modules/users/infra/http/routes/profiles.routes';
import photosRouter from '@modules/photos/infra/http/routes/photos.routes';
import refreshTokensRouter from '@modules/users/infra/http/routes/refreshTokens.routes';
import semestersRouter from '@modules/semesters/infra/http/routes/semesters.routes';
import subjectsRouter from '@modules/subjects/infra/http/routes/subjects.routes';
import classesRouter from '@modules/semesters/infra/http/routes/classes.routes';
import attendancesRouter from '@modules/semesters/infra/http/routes/attendances.routes';
import classesTeacherRouter from '@modules/semesters/infra/http/routes/classesTeacher.routes';
import subjectsTeacherRouter from '@modules/subjects/infra/http/routes/subjectsTeacher.routes';
import recognitionRouter from '@modules/recognition/infra/http/routes/recognition.routes';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const v1Router = Router();

v1Router.use('/users', usersRouter);
v1Router.use('/teachers', teachersRouter);
v1Router.use('/students', studentsRouter);
v1Router.use('/sessions', sessionsRouter);
v1Router.use('/refresh-tokens', refreshTokensRouter);

v1Router.use((request: Request, response: Response, next: NextFunction) => {
  ensureAuthenticated(['admin', 'student', 'teacher'], request, response, next);
});

v1Router.use('/photos', photosRouter);
v1Router.use('/profiles', profilesRouter);

v1Router.use((request: Request, response: Response, next: NextFunction) => {
  ensureAuthenticated(['admin', 'teacher'], request, response, next);
});
v1Router.use('/classes', classesTeacherRouter);
v1Router.use('/subjects', subjectsTeacherRouter);
v1Router.use('/subjects', subjectsRouter);
v1Router.use('/classes', classesRouter);
v1Router.use('/recognition', recognitionRouter);
v1Router.use('/attendances', attendancesRouter);
v1Router.use('/semesters', semestersRouter);

v1Router.use((request: Request, response: Response, next: NextFunction) => {
  ensureAuthenticated(['admin'], request, response, next);
});

export default v1Router;
