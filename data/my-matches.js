import { db } from '../mysql.js';
import { getMatchesByUserIdQuery } from '../query/my-matches.js';

export async function getMatchesByUserId(userId) {
  try {
    const [rows] = await db.query(getMatchesByUserIdQuery, [userId]);
    console.log(rows)
    return rows;
  } catch (error) {
    console.error('Failed to fetch matches by user ID:', error);
    throw error;
  }
}
