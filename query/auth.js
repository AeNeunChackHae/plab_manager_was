export const authQuery = {
    selectUserByEmail: "SELECT * FROM PFB_MANAGER WHERE email=?",
    selectUserByphone: "SELECT * FROM PFB_MANAGER WHERE phone_number=?",
    insertUser:
      "INSERT INTO PFB_MANAGER (phone_number, email, login_password, manager_name) VALUES (?, ?, ?, ?)",
    findEmail: 
      `
        SELECT email
        FROM PFB_MANAGER
        WHERE manager_name = ?
          AND phone_number = ?
          AND status_code = 1;
      `,
    findUserByInfo: 
      `
        SELECT * FROM PFB_MANAGER
        WHERE manager_name = ? AND phone_number = ? AND email = ?
      `,
    updatePassword: 
      `
        UPDATE PFB_MANAGER 
        SET login_password = ? 
        WHERE id = ?
      `,
};