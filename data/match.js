import { db } from '../mysql.js';
import { matchQuery } from '../query/match.js';

// 매치 상세 정보 조회
export async function getMatchDetailById(matchId) {
    try {
        const [rows] = await db.execute(matchQuery.getMatcheDetailQuery, [matchId]);
        return rows[0]
    } catch (error) {
        console.error('매치 상세 데이터 조회 실패:', error.message);
        throw new Error('매치 상세 데이터 조회 중 오류 발생');
    }
}

// 매치 신청 (manager_id 업데이트)
export async function applyMatch(userId, matchId) {
    return db.execute(matchQuery.applyMatchQuery, [userId, matchId])    
}

export async function getPlayers(matchId) {
    try {
      const [rows] = await db.query(matchQuery.getPlayersByMatchIdQuery, [matchId]);
      return rows;
    } catch (error) {
      console.error('선수 목록 가져오기 실패:', error);
      throw new Error('선수 목록을 불러오는 중 오류 발생');;
    }
  }
  
export async function assignCard(userId, matchId, cardType, descriptionCode) {
    console.log('데이터 매치',userId, matchId, cardType, descriptionCode)
    try {
        const result = await db.query(matchQuery.insertCardQuery, [userId, matchId, cardType, descriptionCode]);
        return result;
    } catch (error) {
        console.error('카드 부여 실패:', error);
        throw new Error('카드를 부여하는 중 오류 발생');
    }
}

// 플레이어의 레벨을 업데이트
export const updatePlayerLevel = async (userId, newLevel) => {
  try {
    const result = await db.execute(matchQuery.updatePlayerLevelQuery, [newLevel, userId]);
    return result;
  } catch (error) {
    throw new Error('레벨 업데이트 오류: ' + error.message);
  }
};