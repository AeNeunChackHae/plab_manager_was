import { db } from '../mysql.js'
import { authQuery } from '../query/auth.js'

// 이메일 중복 확인
export async function findByEmail(email) {
    return db.execute(authQuery.selectUserByEmail, [email])
        .then((result) => result[0][0])
}

// 폰 번호 중복 확인
export async function findByPhone(phone_number) {
    return db.execute(authQuery.selectUserByphone, [phone_number])
        .then((result) => result[0][0])
}

// 회원가입
export async function createUser(user) {
    const {phone_number, email, login_password, manager_name} = user
    return db.execute(authQuery.insertUser , [phone_number, email, login_password, manager_name])
        .then((result) => result[0].insertId)
}

// 사용자 ID로 찾기
export async function findById(id) {
    const query = 'SELECT * FROM PFB_MANAGER WHERE id=?';
    return db.execute(query, [id])
      .then((result) => result[0][0]);
  }