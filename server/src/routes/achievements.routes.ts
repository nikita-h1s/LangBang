import {Router} from "express";
import {
    createAchievement,
    getUserAchievements, grantAchievementToUser
} from "../controllers/achievements.controller";

const router = Router();

router.post('/achievements', createAchievement);
router.post('/users/:userId/achievements/:achievementId', grantAchievementToUser)
router.get('/users/:userId/achievements', getUserAchievements);

export default router;