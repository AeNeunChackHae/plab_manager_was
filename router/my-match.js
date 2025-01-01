import express from 'express';
import { fetchMyMatches } from '../controller/my-matches.js';


const router = express.Router();
router.post('/my', fetchMyMatches);

export default router;