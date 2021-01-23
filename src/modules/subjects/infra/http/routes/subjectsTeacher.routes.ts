import { Router } from 'express';
import SubjectsTeacherController from '../controllers/SubjectsTeacherController';

const subjectsTeacherRouter = Router();
const subjectsTeacherController = new SubjectsTeacherController();

subjectsTeacherRouter.get(
  '/teacher/:teacherId',
  subjectsTeacherController.list,
);
subjectsTeacherRouter.get('/teacher', subjectsTeacherController.list);

export default subjectsTeacherRouter;
