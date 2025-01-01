import { getMatchDetailById, applyMatch } from '../data/match.js';

// 매치 상세 정보 반환
export async function fetchMatchDetail(req, res) {
    try {
        const { matchId } = req.body;
    
        // matchId가 숫자인지 확인
        if (isNaN(matchId)) {
            return res.status(400).json({ message: '유효한 matchId를 제공해주세요.' });
        }
            const matchDetail = await getMatchDetailById(matchId);

            if (!matchDetail) {
                return res.status(404).json({ message: '해당 매치를 찾을 수 없습니다.' });
            }

            res.status(200).json(matchDetail);
    }catch(error){
        return res.json({ message: 'matchId를 못 받았습니다'})
    }
}

// 매치 신청
export async function applyForMatch(req, res) {
    try {
        const { matchId } = req.body;

        // 요청 본문 검증
        if (!matchId) {
            return res.status(400).json({ message: 'matchId를 제공해야 합니다.' });
        }

        // matchId가 숫자인지 확인
        if (isNaN(matchId)) {
            return res.status(400).json({ message: '유효한 matchId를 제공해주세요.' });
        }

        const userId = req.userId; // 미들웨어에서 검증된 사용자 ID 사용
        console.log('신청 사용자 ID:', userId);

        // 매치 신청 (manager_id 업데이트)
        const [result] = await applyMatch(userId, matchId);

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: '이미 신청된 매치이거나 존재하지 않는 매치입니다.' });
        }

        res.status(200).json({ message: '매치가 성공적으로 신청되었습니다.' });
    } catch (error) {
        console.error('매치 신청 실패:', error.message);
        res.status(500).json({ message: '매치 신청 중 오류가 발생했습니다.' });
    }
}