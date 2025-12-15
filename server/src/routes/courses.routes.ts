import { Router } from 'express';
import {getAllCourses, createCourse, enrollForCourse,
    updateCourse, deleteCourse} from "../controllers/courses.controller";
import {authenticateToken} from "../middlewares/auth.middleware";
import {requirePermission} from "../middlewares/permission.middleware";

const router = Router();

router.get('/', getAllCourses);
router.post('/', authenticateToken, requirePermission('manage_course'), createCourse);
router.post('/enrollments', authenticateToken, enrollForCourse);
router.patch('/:courseId', authenticateToken,
    requirePermission('manage_course'), updateCourse);
router.delete('/:courseId', authenticateToken,
    requirePermission('manage_course'), deleteCourse);

export default router;