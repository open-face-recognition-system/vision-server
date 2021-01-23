import { Router } from 'express';
import ClassesTeacherController from '../controllers/ClassesTeacherController';

const classesTeacherRouter = Router();
const classesTeacherController = new ClassesTeacherController();

classesTeacherRouter.get('/teacher/:teacherId', classesTeacherController.list);
classesTeacherRouter.get('/teacher', classesTeacherController.list);

export default classesTeacherRouter;
