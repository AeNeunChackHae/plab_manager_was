import * as mymatchData from '../data/my-matches.js';

// 매치 데이터를 반환하는 컨트롤러
export async function fetchMyMatches(req, res) {
    try {
        const { userId } = req.body; // 요청에서 유저 ID 추출
        

        if (!userId) {
            return res.status(400).json({ message: '유저 id가 필요합니다.' });
        }

        // 유저 ID로 매치 데이터를 가져옴
        const matches = await mymatchData.getMatchesByUserId(userId);

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
            message: `유저 ID ${userId}의 매치 목록입니다.`,
            data: matchList,
        });
    } catch (error) {
        console.error('유저 ID로 매치 데이터를 가져오는 중 오류 발생:', error.message);
        res.status(500).json({ message: '매치 데이터를 가져오는 중 오류가 발생했습니다.' });
    }
}

export async function cancelMatchController(req, res) {
    const { matchId } = req.body;
    console.log(matchId)

    // 요청 데이터 검증
    if (!matchId) {
        return res.status(400).json({ error: '잘못된 요청: 매치 ID가 필요합니다.' });
    }

    try {
        const result = await mymatchData.cancelMatchById(matchId);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: '매치를 찾을 수 없거나 이미 취소되었습니다.' });
        }

        res.status(200).json({ message: '매치가 성공적으로 취소되었습니다.' });
    } catch (error) {
        console.error('매치를 취소하는 중 오류 발생:', error.message);
        res.status(500).json({ error: '매치를 취소하는 중 서버 오류가 발생했습니다.' });
    }
}