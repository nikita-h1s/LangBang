import {Router} from 'express';
import {
    deleteUser,
    getMyProfile,
    updateUserRole,
    updateMyProfile,
    getMyStats
} from "../controllers/users.controller.js";
import {authenticateToken} from "../middlewares/auth.middleware.js";
import {requirePermission} from "../middlewares/permission.middleware.js";

const router = Router();

router.patch('/admin/users/:id', authenticateToken,
    requirePermission('manage_user'), updateUserRole);

router.delete('/admin/users/:id', authenticateToken,
    requirePermission('delete_user'), deleteUser);

router.get('/users/me', authenticateToken, getMyProfile);
router.patch('/users/me', authenticateToken, updateMyProfile);
router.get('/users/me/stats', authenticateToken, getMyStats);

export default router;

