import * as matchData from '../data/match.js';

// 매치 상세 정보 반환
export async function fetchMatchDetail(req, res) {
    try {
        const { matchId } = req.body;
    
        // matchId가 숫자인지 확인
        if (isNaN(matchId)) {
            return res.status(400).json({ message: '유효한 matchId를 제공해주세요.' });
        }
            const matchDetail = await matchData.getMatchDetailById(matchId);

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
        const [result] = await matchData.applyMatch(userId, matchId);

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: '이미 신청된 매치이거나 존재하지 않는 매치입니다.' });
        }

        res.status(200).json({ message: '매치가 성공적으로 신청되었습니다.' });
    } catch (error) {
        console.error('매치 신청 실패:', error.message);
        res.status(500).json({ message: '매치 신청 중 오류가 발생했습니다.' });
    }
}


// POST 요청을 통해 매치 ID를 받아 해당 매치의 플레이어 목록을 가져오는 컨트롤러 함수
export async function fetchPlayers(req, res) {
    try {
      const { matchId } = req.body;
      if (!matchId) {
        return res.status(400).json({ message: '매치 ID가 필요합니다.' });
      }
      console.log('받아온 matchId',matchId)
      const players = await matchData.getPlayers(matchId);
      console.log('받아와서 찾아온 matchId의 payers',players)
      res.status(200).json(players);
    } catch (error) {
      res.status(500).json({ message: '플레이어 목록을 불러오는데 실패했습니다.', error: error.message });
    }
  }
  
  export async function saveMatchCards(req, res) {
    try {
      const { matchId, cards } = req.body;
  
      if (!matchId || !cards || !Array.isArray(cards)) {
        return res.status(400).json({ message: '매치 ID와 유효한 카드 데이터가 필요합니다.' });
      }
  
      console.log('받아온 matchId:', matchId);
      console.log('받아온 카드 데이터:', cards);
  
      for (const { userId, cardType, descriptionCode } of cards) {
        if (!userId || cardType === undefined || descriptionCode === undefined) {
          throw new Error(`유효하지 않은 카드 데이터: ${JSON.stringify({ userId, cardType, descriptionCode })}`);
        }
  
        // matchData의 assignCard 호출
        await matchData.assignCard(userId, matchId, cardType, descriptionCode);
      }
  
      console.log('카드 데이터 저장 성공');
      res.status(200).json({ message: '경기 데이터가 성공적으로 저장되었습니다.' });
    } catch (error) {
      console.error('경기 데이터 저장 오류:', error);
      res.status(500).json({
        message: '경기 데이터를 저장하는 중 오류가 발생했습니다.',
        error: error.message,
      });
    }
  }