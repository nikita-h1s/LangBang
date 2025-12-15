import { Router } from 'express';
import {getAllCourses, createCourse, enrollForCourse,
    updateCourse, deleteCourse} from "../controllers/courses.controller";
import {authenticateToken} from "../middlewares/auth.middleware";
import {requirePermission} from "../middlewares/permission.middleware";

const router = Router();

router.get('/', getAllCourses);
router.post('/', authenticateToken, requirePermission('manage_course'), createCourse);
router.post('/enrollments', enrollForCourse);
router.patch('/:courseId', updateCourse);
router.delete('/:courseId', deleteCourse)

export default router;