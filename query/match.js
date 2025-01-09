export const matchQuery = {
    getMatcheDetailQuery :
    `
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
    `,

    applyMatchQuery :
     `
        UPDATE PFB_MATCH 
            SET manager_id = ? 
            WHERE id = ? AND manager_id IS NULL
    `,

    getPlayersByMatchIdQuery : 
    `
    SELECT u.id, u.username, u.level_code
    FROM PFB_USER u
    JOIN PFB_MATCH_USER mu ON u.id = mu.user_id
    WHERE mu.match_id = ?;
    `,

    insertCardQuery :
    `
        INSERT INTO PFB_CARD (user_id, match_id, card_type, description_code)
        VALUES (?, ?, ?, ?);
    `,
    updatePlayerLevelQuery : 
    `
      UPDATE PFB_USER SET level_code = ? WHERE id = ?;
    `,
    updateMatchUserPositionsQuery: 
    `
        UPDATE PFB_MATCH_USER
        SET user_team = ?, user_number = ?
        WHERE match_id = ? AND user_id = ?;
    `,
    updateAbsentPlayersQuery:
    `
        UPDATE PFB_MATCH_USER
        SET status_code = ?, user_team = NULL, user_number = NULL
        WHERE match_id = ? AND user_id = ?;
    `,

}