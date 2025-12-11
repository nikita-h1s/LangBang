import {Router} from "express";
import {
    createAchievement,
    getUserAchievements, grantAchievementToUser,
    updateAchievement, deleteAchievement
} from "../controllers/achievements.controller";

const router = Router();

router.post('/achievements', createAchievement);
router.post('/users/:userId/achievements/:achievementId', grantAchievementToUser)
router.get('/users/:userId/achievements', getUserAchievements);
router.patch('/achievements/:id', updateAchievement);
router.delete('/achievements/:id', deleteAchievement);

export default router;