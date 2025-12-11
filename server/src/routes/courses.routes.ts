import { Router } from 'express';
import {getAllCourses, createCourse, enrollForCourse,
    updateCourse, deleteCourse} from "../controllers/courses.controller";

const router = Router();

router.get('/', getAllCourses);
router.post('/', createCourse);
router.post('/enrollments', enrollForCourse);
router.patch('/:courseId', updateCourse);
router.delete('/:courseId', deleteCourse)

export default router;