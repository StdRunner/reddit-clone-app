import e, { Router, Request, Response } from "express";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";
import Sub from "../entities/Sub";
import Post from "../entities/Post";

const getPost = async (req: Request, res: Response) => {
    const { identifier, slug } = req.params;
    try {
        const post = await Post.findOneOrFail({
            where: { identifier, slug },
            relations: ["sub", "votes"]
        })

        if(res.locals.user) {
            post.setUserVote(res.locals.user);
        }

        return res.send(post);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: "게시물을 찾을 수 없습니다." });
    }
}

const creatPost = async (req: Request, res: Response) => {
    const { title, body, sub } = req.body;
    if(title.trim() === "") {
        return res.status(400).json({ title: "비워둘 수 없습니다." });
    }

    const user = res.locals.user;

    try {
        const subRecord = await Sub.findOneByOrFail({ name: sub });
        const post = new Post();

        post.title = title;
        post.body = body;
        post.user = user;
        post.sub = subRecord;

        await post.save();

        return res.json(post);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "문제가 발생했습니다." });
    }
}

const router = Router();
router.get("/:identifier/:slug", userMiddleware, getPost);
router.post("/", userMiddleware, authMiddleware, creatPost);

export default router;