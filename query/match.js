export const getMatcheDetailQuery = `
    SELECT 
        M.id AS match_id,
        M.stadium_id,
        M.match_type,
        M.allow_gender,
        M.level_criterion,
        DATE_FORMAT(M.match_start_time, '%Y-%m-%d %H:%i:%s') AS match_start_time,
        DATE_FORMAT(M.match_end_time, '%Y-%m-%d %H:%i:%s') AS match_end_time,
        S.stadium_name,
        S.full_address,
        S.notice
    FROM 
        PFB_MATCH M
    JOIN 
        PFB_STADIUM S ON M.stadium_id = S.id
    WHERE 
        M.id = ?;
`;

export const applyMatchQuery = `
    UPDATE PFB_MATCH 
         SET manager_id = ? 
         WHERE id = ? AND manager_id IS NULL
`;