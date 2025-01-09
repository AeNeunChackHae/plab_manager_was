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
    // 새로운 레벨로 업데이트
    const result = await db.execute(matchQuery.updatePlayerLevelQuery, [newLevel, userId]);
    return result;
  } catch (error) {
    throw new Error('레벨 업데이트 오류: ' + error.message);
  }
};

export async function updateMatchUserPositions(players) {
  try {
    const connection = await db.getConnection(); // 트랜잭션 시작
    await connection.beginTransaction();

    for (const player of players) {
      const { match_id, user_id, user_team, user_number } = player;

      await connection.execute(matchQuery.updateMatchUserPositionsQuery, [
        user_team,
        user_number,
        match_id,
        user_id,
      ]);
    }

    await connection.commit();
    connection.release();
    return true;
  } catch (error) {
    if (connection) await connection.rollback(); // 트랜잭션 롤백
    console.error('PFB_MATCH_USER 업데이트 실패:', error.message);
    throw error;
  }
}

export async function updateAbsentPlayers(absentPlayers) {
  try {
    const connection = await db.getConnection(); // 트랜잭션 시작
    await connection.beginTransaction();

    for (const player of absentPlayers) {
      const { match_id, user_id, status_code } = player;

      // 불참 처리 시 슬롯 정보 초기화
      await connection.execute(matchQuery.updateAbsentPlayersQuery, [
        status_code, // 불참 상태 코드
        match_id,
        user_id,
      ]);
    }

    await connection.commit();
    connection.release();
    return true;
  } catch (error) {
    if (connection) await connection.rollback(); // 트랜잭션 롤백
    console.error('불참 상태 업데이트 실패:', error.message);
    throw error;
  }
}
