export const authQuery = {
    selectUserByEmail: "SELECT * FROM PFB_MANAGER WHERE email=?",
    selectUserByphone: "SELECT * FROM PFB_MANAGER WHERE phone_number=?",
    insertUser:
      "INSERT INTO PFB_MANAGER (phone_number, email, login_password, manager_name) VALUES (?, ?, ?, ?)",
  };