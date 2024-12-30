import { db } from '../mysql.js';
import { getAllMatchesQuery } from '../query/schedule-list.js';

export async function getAllMatches() {
  try {
    const [rows] = await db.query(getAllMatchesQuery);
    return rows;
  } catch (error) {
    console.error('Failed to fetch matches:', error);
    throw error;
  }
}