import express from 'express';
import { fetchMatchSchedule } from '../controller/schedule-list.js';
import { fetchMyMatches } from '../controller/my-matches.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', isAuth, fetchMatchSchedule);

export default router;