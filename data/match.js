import { db } from '../mysql.js';
import { getMatcheDetailQuery, applyMatchQuery } from '../query/match.js';

// 매치 상세 정보 조회
export async function getMatchDetailById(matchId) {
    try {
        const [rows] = await db.execute(getMatcheDetailQuery, [matchId]);
        return rows[0]
    } catch (error) {
        console.error('매치 상세 데이터 조회 실패:', error.message);
        throw new Error('매치 상세 데이터 조회 중 오류 발생');
    }
}

// 매치 신청 (manager_id 업데이트)
export async function applyMatch(userId, matchId) {
    return db.execute(applyMatchQuery, [userId, matchId])    
}