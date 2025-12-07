import { Router } from 'express';
import {getAllCourses, createCourse, enrollForCourse} from "../controllers/courses.controller";

const router = Router();

router.get('/', getAllCourses);
router.post('/', createCourse);
router.post('/enrollments', enrollForCourse);

export default router;