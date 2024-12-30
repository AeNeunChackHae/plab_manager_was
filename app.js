import express from "express";
import dotenv from "dotenv";
import { config } from "./config.js";
import authRouter from "./router/auth.js"
import scheduleRouter from "./router/schedule-list.js"
import cors from "cors";

dotenv.config();

const app = express();

// 미들웨어 설정
app.use(express.json());
// form에서 받은 데이터 처리
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: "*",
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

// 테스트용 라우트
const port = config.hosting_port.manager_back
app.use("/auth", authRouter)
app.use("/manager", scheduleRouter)


// 서버 시작
app.listen(port, () => {
  console.log(`서버 실행 중 http://localhost:${port}`);
});
