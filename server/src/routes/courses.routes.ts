import { Router } from 'express';
import {getAllCourses, createCourse, enrollForCourse,
    updateCourse, deleteCourse} from "../controllers/courses.controller";
import {authenticateToken} from "../middlewares/auth.middleware";
import {requirePermission} from "../middlewares/permission.middleware";
import {
    createCourseSchema, enrollCourseSchema,
    updateCourseSchema
} from "../middlewares/validation/course.schema";
import {validate} from "../middlewares/validation/validate";

const router = Router();

router.get('/', getAllCourses);
router.post('/', authenticateToken, requirePermission('manage_course'),
    validate(createCourseSchema), createCourse);
router.post('/enrollments', authenticateToken, validate(enrollCourseSchema), enrollForCourse);
router.patch('/:courseId', authenticateToken,
    requirePermission('manage_course'), validate(updateCourseSchema), updateCourse);
router.delete('/:courseId', authenticateToken,
    requirePermission('manage_course'), deleteCourse);

export default router;