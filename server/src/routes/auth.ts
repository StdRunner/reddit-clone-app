import { isEmpty, validate } from "class-validator";
import { Router, Request, Response } from "express";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";

const mapError = (errors: Object[]) => {
    return errors.reduce((prev: any, err: any) => {
        prev[err.property] = Object.entries(err.constraints)[0][1];
        console.log('Object.entries(err.constraints)', Object.entries(err.constraints));
        console.log('prev', prev);

        return prev;
    }, {})
}

const me = async (_: Request, res: Response) => {
    return res.json(res.locals.user);
}

const register = async (req : Request, res: Response) => {
    const { email, username, password } = req.body;
    
    try {
        let errors: any = {};

        // 이메일과 유저네임이 이미 저장, 사용되고 있는 것인지 확인.
        const emailUser = await User.findOneBy({email});
        const usernameUser = await User.findOneBy({username});

        // 이미 있다면 errors 객체에 넣어줌.
        if(emailUser) errors.email = "이미 해당 이메일 주소가 사용되었습니다."
        if(usernameUser) errors.username = "이미 이 사용자 이름이 사용되었습니다."

        // 에러가 있다면 return으로 에러를 response 보내줌.
        if(Object.keys(errors).length > 0) {
            return res.status(400).json(errors)
        }

        const user = new User();
        user.email = email;
        user.username = username;
        user.password= password;

        // 엔티티에 정해놓은 조건으로 user 데이터의 유효성 검사를 해준다.
        errors = await validate(user);
        // 엔티티 클래스에 정의한 메시지대로 에러 출력
        console.log('errors', errors);

        if(errors.length>0) return res.status(400).json(mapError(errors));

        // 유저 정보를 user 테이블에
        await user.save()
        return res.json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error});
    }
}


const login = async (req : Request, res: Response) => {
    const { username, password } = req.body;

    try {
        let errors: any = {};

        // 파라미터가 비워져 있다면 에러를 프론트로 보내주기
        if(isEmpty(username)) errors.username = "사용자 이름은 비워둘 수 없습니다.";
        if(isEmpty(password)) errors.password = "비밀번호는 비워둘 수 없습니다.";
        if(Object.keys(errors).length > 0) {
            return res.status(400).json(errors);
        }

        // DB에서 유저 찾기
        const user = await User.findOneBy({ username });

        // 유저가 없다면 에러 보내기
        if(!user) return res.status(404).json({ username: "사용자 이름이 등록되지 않았습니다." });

        // 유저가 있다면 비밀번호 비교하기
        const passwordMatches = await bcrypt.compare(password, user.password);

        if(!passwordMatches) {
            return res.status(401).json({ password: "비밀번호가 잘못되었습니다." });
        }

        // 비밀번호가 맞가면 토큰 생성
        const token = jwt.sign({ username }, process.env.JWT_SECRET);

        // 쿠키 저장
        // var setCookie = cookie.selialize('foo', 'bar');
        res.set(
            "Set-Cookie",
            cookie.serialize("token", token, {
                httpOnly: true,
                // secure: process.env.NODE_ENV === "development",
                // sameSite: "strict",
                maxAge: 60 * 60 * 24 * 7, // 1week
                path: "/"
            })
        );

        return res.json({ user, token });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

const router = Router();
router.get("/me", userMiddleware, authMiddleware, me);
router.post("/register", register);
router.post("/login", login);

// export default router;
export default router;