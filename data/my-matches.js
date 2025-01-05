import { db } from '../mysql.js';
import { mymatchQuery }from '../query/my-matches.js';

export async function getMatchesByUserId(userId) {
  try {
    const [rows] = await db.query(mymatchQuery.getMatchesByUserIdQuery, [userId]);
    // console.log(rows)
    return rows;
  } catch (error) {
    console.error('사용자 ID로 매치 데이터를 가져오는 중 오류 발생:', error);
    throw error;
  }
}

export async function cancelMatchById(matchId) {
  try {
      const [result] = await db.query(mymatchQuery.cancelMatchQuery, [matchId]);
      return result;
  } catch (error) {
      console.error('매치 ID로 매치를 취소하는 중 오류 발생:', error);
      throw error;
  }
}