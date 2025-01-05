import * as authRepository from '../data/auth.js'
import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { config } from '../config.js'
import { hashPassword, generateTemporaryPassword } from "../utils/password.js";
import { sendEmail } from "../utils/email.js";

async function createJwtToken(id) {
    return jwt.sign(
    {id}, config.jwt.manager_secretKey, {expiresIn: config.jwt.expiresInSec})
}

// 회원가입
export async function signup(req, res, next) {
    try {
        const { email, login_password, login_password_confirm, manager_name, phone_number} = req.body
    
        const foundEmail = await authRepository.findByEmail(email)
        if(foundEmail){
            return res.status(409).json({message: `${email}이 이미 있습니다`})
        }
    
        const foundPhone = await authRepository.findByPhone(phone_number)
        if(foundPhone){
            return res.status(409).json({message: `${phone_number} 이미 있습니다`})
        }
    
        if (login_password !== login_password_confirm) {
            return res.status(400).send({message: "비밀번호와 비밀번호 확인이 일치하지 않습니다."})
        }
    
        const hashed = await bcrypt.hash(login_password, config.bcrypt.saltRounds)
        const users = await authRepository.createUser({phone_number, email, login_password: hashed, manager_name})
        const token = await createJwtToken(users.id)
        res.status(201).json({token, email})
    } catch (err) {
        res.status(400).send(err.message);
    }
}

// 로그인
export async function login(req, res, next) {
    try {
      const { email, login_password } = req.body;
  
      // 이메일로 사용자 검색
      const user = await authRepository.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "등록된 이메일이 없습니다." });
      }
       if (user.status_code === 0) {
        return res.status(403).json({ message: "승인 대기 중인 계정입니다." });
    }
  
      // 비밀번호 검증
      const isValidPassword = await bcrypt.compare(login_password, user.login_password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
      }
  
      // JWT 토큰 생성 및 응답
      const token = await createJwtToken(user.id);
      res.status(200).json({ token, id: user.id, manager_name: user.manager_name });
    } catch (error) {
      // 예외 처리 및 서버 오류 방지
      console.error("로그인 중 오류 발생:", error.message);
      res.status(500).json({ message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." });
    }
  }
  

// 토큰 인증
export async function verify(req, res, next) {
    const token = req.header['Token']
    console.log('Token 인증 확인', token)
    if(token){
        res.status(200).json(token)
    }
}

// 로그인(토큰) 유지
export async function me(req, res, next) {
    const user = await authRepository.findById(req.userId)
    if(!user){
        return res.status(404).json({message:`일치하는 사용자가 없음`})
    }
    res.status(200).json({token: req.token, id: user.id})
}

// 이메일 찾기위한 유저  확인인
export async function findEmailController(req, res) {
  const { username, phoneNumber } = req.body;
  console.log('username, phoneNumber',username, phoneNumber)

  // 입력 값 검증
  if (!username || !phoneNumber) {
    return res.status(400).json({ message: '모든 필드를 입력해야 합니다.' });
  }

  try {
    const email = await authRepository.findEmailByUserInfo(username, phoneNumber);

    if (!email) {
      return res.status(404).json({ message: '일치하는 사용자를 찾을 수 없습니다.' });
    }

    res.status(200).json({ email });
  } catch (error) {
    console.error('Error in findEmailController:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}

// 비밀번호 찾기 및 재설정정
export async function sendResetPasswordEmail(req, res) {
    console.log('리엑트에서 쐈음')
    const { name, phoneNumber, email } = req.body;
    console.log(' name, phoneNumber, email', name, phoneNumber, email)
  
    // 입력값 검증
    if (!name || !phoneNumber || !email) {
      return res.status(400).json({ message: "모든 필드를 입력해야 합니다." });
    }
  
    try {
      // 유저 정보 조회
      const user = await authRepository.findUserByInfo(name, phoneNumber, email);
      console.log('user',user)
  
      if (!user) {
        return res.status(404).json({ message: "일치하는 사용자를 찾을 수 없습니다." });
      }
  
      // 임시 비밀번호 생성 및 해시화
      const temporaryPassword = generateTemporaryPassword();
      const hashedPassword = await hashPassword(temporaryPassword);
  
      // DB에 비밀번호 업데이트
      await authRepository.updatePassword(user.id, hashedPassword);
  
      // 이메일 전송
      await sendEmail({
        to: email, // 유저 이메일
        subject: "임시 비밀번호 발급",
        text: `안녕하세요, ${name}님.\n\n임시 비밀번호는 다음과 같습니다: ${temporaryPassword}\n로그인 후 반드시 비밀번호를 변경해주세요. \n임시 비밀번호인 만큼, 로그인하신 후 직접 비밀번호를 꼭 변경해 주세요.`,
      });
  
      res.status(200).json({ message: "임시 비밀번호가 이메일로 전송되었습니다." });
    } catch (error) {
      console.error("Error in sendResetPasswordEmail:", error);
      res.status(500).json({ message: "이메일 전송 중 오류가 발생했습니다." });
    }
  }