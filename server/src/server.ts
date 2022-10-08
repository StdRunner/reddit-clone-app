// 필요 npm 모듈 import
import express from "express";
import morgan from "morgan";
import { AppDataSource } from "./data-source";
import authRoutes from "./routes/auth"
import cors from "cors";

const app = express();
const origin = "http://localhost:3000";

app.use(cors({
    origin
}));
app.use(express.json());
/**
 * morgan : node.js 백엔드 서버 사용 시 로그 미들웨어
 *  - dev
 *  - short
 *  - tiny
 */
app.use(morgan("dev"));
// app.get의 url로 접속 시 해당 블록 코드 실행
// Controller
app.get("/", (_, res) => res.send("running"));
app.use("/api/auth", authRoutes)

let port = 5000;
// app.listen의 포트로 접속하면 해당 블록 코드 실행
app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);

    AppDataSource.initialize().then(async () => {
        console.log("database initialize")
    }).catch(error => console.log(error))

})