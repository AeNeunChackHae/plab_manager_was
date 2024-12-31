import { getAllMatches } from '../data/schedule-list.js';

// 매치 데이터를 반환하는 컨트롤러
export async function fetchMatchSchedule(req, res) {
  try {
    const user = req.user;
    console.log('인증된 사용자 이메일:', user.email);

    // 모든 매치 데이터를 가져옴
    const matches = await getAllMatches();

    // 응답 데이터 가공
    const matchList = matches.map(match => ({
      match_id: match.match_id,
      match_type: match.match_type,
      start_time: match.match_start_time,
      end_time: match.match_end_time,
      stadium_name: match.stadium_name,
      gender: match.allow_gender,
      level: match.level_criterion,
      region: match.main_region,
      address: match.full_address,
    }));

    res.status(200).json({
      message: `Hello ${user.manager_name}, here are your matches.`,
      data: matchList,
    });
  } catch (error) {
    console.error('매치 데이터 반환 실패:', error.message);
    res.status(500).json({ message: '매치 데이터를 불러오는 중 오류가 발생했습니다.' });
  }
}