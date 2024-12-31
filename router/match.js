import express from 'express';
import { isAuth } from '../middleware/auth.js';
import { fetchMatchDetail, applyForMatch } from '../controller/match.js';

const router = express.Router();

// 매치 상세 정보 라우트
router.post('/match-detail/matchId', isAuth, fetchMatchDetail);
router.post('/match-apply', isAuth, applyForMatch);

export default router;