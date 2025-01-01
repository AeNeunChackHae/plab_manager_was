export const getMatchesByUserIdQuery = `
  SELECT 
      M.id AS match_id,
      M.match_type,
      DATE_FORMAT(M.match_start_time, '%Y-%m-%d %H:%i:%s') AS match_start_time,
      DATE_FORMAT(M.match_end_time, '%Y-%m-%d %H:%i:%s') AS match_end_time,
      M.stadium_id,
      M.allow_gender,
      M.level_criterion,
      S.stadium_name,
      S.main_region,
      S.full_address
  FROM 
      PFB_MATCH M
  JOIN 
      PFB_STADIUM S ON M.stadium_id = S.id
  WHERE 
      M.manager_id = ? -- 유저 ID에 따라 필터링
  ORDER BY 
      DATE(M.match_start_time) ASC,
      M.match_start_time ASC;
`;
