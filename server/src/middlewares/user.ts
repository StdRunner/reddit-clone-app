import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 먼저 Subs를 생성할 수 있는 유저인지 체크를 위해 유저 정보 가져오기 (요청에서 보내주는 토큰을 이용)
        const token = req.cookies.token;

        // 유저 정보가 없다면 throw error!
        if(!token) return next();

        // 유저 정보가 있다면 sub 이름과 제목이 이미 있는 것인지 체크
        const { username }:any = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOneBy({ username });
        console.log("User MW", user);

        if(!user) throw new Error("User MW : Unauthenticated");

        // 유저 정보를 res.locals.user에 넣어주기
        res.locals.user = user;
        return next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: "User MW : Somthing went wrong" });
    }
}