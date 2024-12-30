import jwt from 'jsonwebtoken';
import * as authRepository from '../data/auth.js';
import { config } from '../config.js';

export const isAuth = async (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!(authHeader && authHeader.startsWith("Bearer "))) {
    return res.status(401).json({ message: "유효하지 않은 인증 정보입니다." });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "토큰이 유효하지 않습니다." });
    }

    console.log("Decoded Token:", decoded);

    if (!decoded.id) {
      return res.status(401).json({ message: "토큰에 ID가 없습니다." });
    }

    try {
      const user = await authRepository.findById(decoded.id);
      console.log('User found:', user);
      if (!user) {
        return res.status(401).json({ message: "사용자를 찾을 수 없습니다." });
      }

      req.userId = user.id;
      req.user = user;
      next();
    } catch (err) {
      console.error("사용자 조회 중 오류 발생:", err.message);
      return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
  });
};