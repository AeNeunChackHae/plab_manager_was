import { getAllMatches } from '../data/schedule-list.js';

// 날짜별로 매치를 그룹화하는 함수
function groupMatchesByDate(matches) {
  return matches.reduce((acc, match) => {
    // match_start_time을 문자열로 변환
    const startTime = match.match_start_time instanceof Date
      ? match.match_start_time.toISOString().split('T')[0] // YYYY-MM-DD 형식으로 변환
      : match.match_start_time.split(' ')[0]; // 이미 문자열이라면 그대로 처리

    if (!acc[startTime]) {
      acc[startTime] = [];
    }

    acc[startTime].push({
      match_id: match.match_id,
      match_type: match.match_type,
      start_time: match.match_start_time,
      end_time: match.match_end_time,
      stadium_name: match.stadium_name,
      region: match.main_region,
      address: match.full_address,
    });
    return acc;
  }, {});
}

// 매치 데이터를 반환하는 컨트롤러
export async function fetchMatchSchedule(req, res) {
  try {
    const user = req.user;
    console.log('인증된 사용자 이메일:', user.email);

    const matches = await getAllMatches();
    const groupedMatches = groupMatchesByDate(matches);

    res.status(200).json({
      message: `Hello ${user.manager_name}, here are your matches.`,
      data: groupedMatches,
    });
  } catch (error) {
    console.error('매치 데이터 반환 실패:', error.message);
    res.status(500).json({ message: '매치 데이터를 불러오는 중 오류가 발생했습니다.' });
  }
}
