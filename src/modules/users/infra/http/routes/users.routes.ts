import { Router } from 'express';

import UsersController from '../controllers/UsersController';
import authorize from '@shared/infra/http/middlewares/authorize';
import Role from '@modules/users/infra/typeorm/entities/Role';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.delete('/:id', authorize(Role.ADMIN), usersController.delete);

export default usersRouter;
