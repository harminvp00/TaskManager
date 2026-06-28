

import { Router } from 'express';
import { googleCallback, googleLogin } from './googleAuth.controller.js';

const router = Router();

router.get('/login', googleLogin)
router.get('/callback', googleCallback);

export default router;