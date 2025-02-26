import express from 'express';
import { isAuth } from '../middleware/auth.js';
import * as matchController from '../controller/match.js';

const router = express.Router();

// 매치 상세 정보 라우트
router.post('/match-detail/matchId', isAuth, matchController.fetchMatchDetail);
router.post('/match-apply', isAuth, matchController.applyForMatch);
router.post('/players', isAuth, matchController.fetchPlayers);
router.post('/save-cards', isAuth, matchController.saveMatchCards);
router.post('/update-levels',isAuth, matchController.adjustPlayerLevel);
router.post('/update-positions', isAuth, matchController.updateMatchPositions);

export default router;