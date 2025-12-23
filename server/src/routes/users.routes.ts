import {Router} from 'express';
import {deleteUser, updateUserRole} from "../controllers/users.controller";
import {authenticateToken} from "../middlewares/auth.middleware";
import {requirePermission} from "../middlewares/permission.middleware";

const router = Router();

router.patch('/admin/users/:id', authenticateToken,
    requirePermission('manage_user'), updateUserRole);

router.delete('/admin/users/:id', authenticateToken,
    requirePermission('delete_user'), deleteUser);

export default router;

