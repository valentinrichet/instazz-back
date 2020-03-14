import express, { Router } from "express";
import multer from "multer";
import PostController from "../../controllers/v1/posts";
import { CreationPostDto, PostDto } from "../../dto/v1/posts";
import { getDiskStorage, imageFilter } from "../../libs/upload";
import { verifyJWT_MW } from "../../middlewares/auth";
import validator from "../../middlewares/validator";
import { UserData } from "../../types/user_data";

const router: Router = express.Router();

router.get("/v1/posts", verifyJWT_MW);
router.get("/v1/posts", async (req, res, next) => {
    try {
        const postsDto: PostDto[] = await PostController.getPosts();
        return res.send(postsDto);
    } catch (error) {
        next(error);
    }
});

router.get("/v1/posts/:id", verifyJWT_MW);
router.get("/v1/posts/:id", async (req, res, next) => {
    try {

        const postId: string = req.params.id;
        const postDto: PostDto | null = await PostController.getPost(postId);
        if (postDto == null) {
            return res.status(404).send(`Post with id "${postId}" wasn't found`);
        }
        return res.send(postDto);
    } catch (error) {
        next(error);
    }
});

router.post("/v1/posts", verifyJWT_MW);
router.post("/v1/posts", multer({ storage: getDiskStorage(), fileFilter: imageFilter }).single("content"), async (err: any, req: any, res: any, next: any) => {
    const { title, description, ...tmp } = req.body;
    req.body = { title, description };
    (req as any).tmp = tmp;
    next();
});
router.post("/v1/posts", PostController.validate("createPost"), validator);
router.post("/v1/posts", async (req, res) => {
    if (req.file == null) {
        return res.status(400).send("An image is missing, please upload one.");
    }
    const userData: UserData = ((req as any).user as UserData);
    const creationPostDto: CreationPostDto = new CreationPostDto(req.body);
    req.body = (req as any).tmp;
    const postDto: PostDto = await PostController.createPost(userData.id, req.file.path, creationPostDto);
    return res.send(postDto);
});

export const PostRoute = router;