import { Router } from 'express';
import ClassesTeacherController from '../controllers/ClassesTeacherController';
import authorize from '@shared/infra/http/middlewares/authorize';
import Role from '@modules/users/infra/typeorm/entities/Role';

const classesTeacherRouter = Router();
const classesTeacherController = new ClassesTeacherController();

classesTeacherRouter.get('/teacher/:teacherId', authorize(Role.ADMIN), classesTeacherController.list);
classesTeacherRouter.get('/teacher', authorize(Role.TEACHER), classesTeacherController.list);

export default classesTeacherRouter;
