import { Router } from 'express';
import SubjectsTeacherController from '../controllers/SubjectsTeacherController';
import authorize from '@shared/infra/http/middlewares/authorize';
import Role from '@modules/users/infra/typeorm/entities/Role';

const subjectsTeacherRouter = Router();
const subjectsTeacherController = new SubjectsTeacherController();

subjectsTeacherRouter.get(
  '/teacher/:teacherId', authorize(Role.ADMIN),
  subjectsTeacherController.list,
);
subjectsTeacherRouter.get('/teacher', authorize(Role.TEACHER), subjectsTeacherController.list);

export default subjectsTeacherRouter;
