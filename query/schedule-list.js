export const getAllMatchesQuery = `
  SELECT 
      M.id AS match_id,
      M.match_type,
      M.match_start_time,
      M.match_end_time,
      M.stadium_id,
      S.stadium_name,
      S.main_region,
      S.full_address
  FROM 
      PFB_MATCH M
  JOIN 
      PFB_STADIUM S ON M.stadium_id = S.id
  ORDER BY 
      DATE(M.match_start_time) ASC,
      M.match_start_time ASC;
`;
