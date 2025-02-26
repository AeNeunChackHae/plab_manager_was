export const getAllMatchesQuery = `
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
      DATE(M.match_start_time) BETWEEN DATE_ADD(CURDATE(), INTERVAL 7 DAY) 
      AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
      AND (M.manager_id IS NULL OR M.manager_id = '')
  ORDER BY 
      DATE(M.match_start_time) ASC,
      M.match_start_time ASC;
`;
