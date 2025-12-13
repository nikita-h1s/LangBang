import { Router } from 'express';
import {
    addLanguage,
    getLanguages,
    grantLanguageToUser,
    getUserLanguages,
    updateLanguage,
    deleteLanguage
} from '../controllers/languages.controller';
import {authenticateToken} from "../middlewares/auth.middleware";

const router = Router();

router.get('/languages', getLanguages);
router.get('/users/:userId/languages', authenticateToken, getUserLanguages);
router.post('/languages', authenticateToken, addLanguage);
router.post('/users/:userId/languages/:languageId', authenticateToken, grantLanguageToUser);
router.patch('/languages/:id', authenticateToken, updateLanguage);
router.delete('/languages/:id', authenticateToken, deleteLanguage);

export default router;