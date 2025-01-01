import { getMatchesByUserId } from '../data/my-matches.js';

// 매치 데이터를 반환하는 컨트롤러
export async function fetchMyMatches(req, res) {
    try {
        const { userId } = req.body; // 요청에서 유저 ID 추출

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        // 유저 ID로 매치 데이터를 가져옴
        const matches = await getMatchesByUserId(userId);

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
            message: `Here are the matches for user ID: ${userId}`,
            data: matchList,
        });
    } catch (error) {
        console.error('Failed to fetch matches by user ID:', error.message);
        res.status(500).json({ message: 'An error occurred while fetching match data.' });
    }
}
