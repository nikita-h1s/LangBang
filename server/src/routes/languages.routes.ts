import { Router } from 'express';
import {addLanguage, getLanguages} from '../controllers/languages.controller';

const router = Router();

router.get('/', getLanguages);
router.post('/', addLanguage);

export default router;