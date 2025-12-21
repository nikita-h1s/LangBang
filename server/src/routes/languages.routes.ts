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
import {requirePermission} from "../middlewares/permission.middleware";
import {validate} from "../middlewares/validation/validate";
import {
    createLanguageSchema, updateLanguageSchema
} from "../middlewares/validation/language.schema";

const router = Router();

router.get('/languages', authenticateToken, getLanguages);
router.get('/users/:userId/languages', authenticateToken, getUserLanguages);
router.post('/languages', authenticateToken,
    requirePermission('manage_language'), validate(createLanguageSchema), addLanguage);
// TODO: Change to grantLanguageToUser(userId, languageId) without http request
router.post('/users/:userId/languages/:languageId', authenticateToken, grantLanguageToUser);
router.patch('/languages/:id', authenticateToken,
    requirePermission('manage_language'), validate(updateLanguageSchema), updateLanguage);
router.delete('/languages/:id', authenticateToken,
    requirePermission('manage_language'), deleteLanguage);

export default router;