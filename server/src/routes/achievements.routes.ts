import {Router} from "express";
import {
    createAchievement,
    getUserAchievements, grantAchievementToUser,
    updateAchievement, deleteAchievement
} from "../controllers/achievements.controller";
import {authenticateToken} from "../middlewares/auth.middleware";
import {requirePermission} from "../middlewares/permission.middleware";

const router = Router();

router.post('/achievements', authenticateToken,
    requirePermission('manage_achievement'), createAchievement);
// TODO: Change to grantAchievementToUser(userId, achievementId) without http request
router.post('/users/:userId/achievements/:achievementId', grantAchievementToUser);
router.get('/users/:userId/achievements', authenticateToken, getUserAchievements);
router.patch('/achievements/:id', authenticateToken,
    requirePermission('manage_achievement'), updateAchievement);
router.delete('/achievements/:id', authenticateToken,
    requirePermission('manage_achievement'), deleteAchievement);

export default router;