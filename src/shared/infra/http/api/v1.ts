import { Router } from 'express';

import usersRouter from '@modules/users/infra/http/routes/users.routes';
import teachersRouter from '@modules/users/infra/http/routes/teachers.routes';
import studentsRouter from '@modules/users/infra/http/routes/students.routes';

const v1Router = Router();

v1Router.use('/users', usersRouter);
v1Router.use('/teachers', teachersRouter);
v1Router.use('/students', studentsRouter);

export default v1Router;
