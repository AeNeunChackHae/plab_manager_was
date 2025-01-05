import express from 'express';
import { isAuth } from '../middleware/auth.js';
import * as mymatchController from '../controller/my-matches.js';

const router = express.Router();

router.post('/my', isAuth, mymatchController.fetchMyMatches);
router.post('/cancel', isAuth, mymatchController.cancelMatchController);

export default router;