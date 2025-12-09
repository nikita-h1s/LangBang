import { Router } from 'express';
import {
    addLanguage,
    getLanguages,
    grantLanguageToUser,
    getUserLanguages
} from '../controllers/languages.controller';

const router = Router();

router.get('/languages', getLanguages);
router.get('/users/:userId/languages', getUserLanguages);
router.post('/languages', addLanguage);
router.post('/users/:userId/languages/:languageId', grantLanguageToUser);

export default router;