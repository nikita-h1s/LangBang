import { Router } from 'express';
import {
    addLanguage,
    getLanguages,
    grantLanguageToUser,
    getUserLanguages,
    updateLanguage,
    deleteLanguage
} from '../controllers/languages.controller';

const router = Router();

router.get('/languages', getLanguages);
router.get('/users/:userId/languages', getUserLanguages);
router.post('/languages', addLanguage);
router.post('/users/:userId/languages/:languageId', grantLanguageToUser);
router.patch('/languages/:id', updateLanguage);
router.delete('/languages/:id', deleteLanguage);

export default router;