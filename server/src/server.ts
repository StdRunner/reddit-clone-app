// 필요 npm 모듈 import
import express from "express";
import morgan from "morgan";
import { AppDataSource } from "./data-source";
import authRoutes from "./routes/auth";
import subRoutes from "./routes/subs";
import postRoutes from "./routes/posts";
import voteRoutes from "./routes/votes";
import userRoutes from "./routes/users";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const app = express();
const origin = process.env.ORIGIN;

app.use(cors({
    origin,
    credentials: true
}));
app.use(express.json());
/**
 * morgan : node.js 백엔드 서버 사용 시 로그 미들웨어
 *  - dev
 *  - short
 *  - tiny
 */
app.use(morgan("dev"));
app.use(cookieParser());

dotenv.config();

// app.get의 url로 접속 시 해당 블록 코드 실행
// Controller
app.get("/", (_, res) => res.send("running"));
app.use("/api/auth", authRoutes)
app.use("/api/subs", subRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/votes", voteRoutes)
app.use("/api/users", userRoutes)

app.use(express.static("public"));

let port = 5000;
// app.listen의 포트로 접속하면 해당 블록 코드 실행
app.listen(port, async () => {
    console.log(`Server running at ${process.env.APP_URL}`);

    AppDataSource.initialize().then(async () => {
        console.log("database initialize")
    }).catch(error => console.log(error))

})