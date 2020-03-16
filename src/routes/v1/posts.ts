import express, { Router } from "express";
import multer from "multer";
import PostController from "../../controllers/v1/posts";
import { CreationPostDto, PostDto, UpdatePostDto } from "../../dto/v1/posts";
import { getDiskStorage, imageFilter } from "../../libs/upload";
import { verifyJWT_MW } from "../../middlewares/auth";
import validator from "../../middlewares/validator";
import { UserData } from "../../types/user_data";

const router: Router = express.Router();

router.get("/v1/posts", verifyJWT_MW);
router.get("/v1/posts", async (req, res, next) => {
    try {
        const userData: UserData = ((req as any).user as UserData);
        const postsDto: PostDto[] = await PostController.getPosts(userData.id);
        return res.send(postsDto);
    } catch (error) {
        next(error);
    }
});

router.get("/v1/posts/:id", verifyJWT_MW);
router.get("/v1/posts/:id", async (req, res, next) => {
    try {
        const postId: string = req.params.id;
        const userData: UserData = ((req as any).user as UserData);
        const postDto: PostDto | null = await PostController.getPost(userData.id, postId);
        if (postDto == null) {
            return res.status(404).send(`Post with id "${postId}" was not found`);
        }
        return res.send(postDto);
    } catch (error) {
        next(error);
    }
});

router.post("/v1/posts", verifyJWT_MW);
router.post("/v1/posts", multer({ storage: getDiskStorage(), fileFilter: imageFilter }).single("content"), async (err: any, req: any, res: any, next: any) => {
    const { content, ...other } = req.body;
    req.body = { ...other };
    next();
});
router.post("/v1/posts", PostController.validate("createPost"), validator);
router.post("/v1/posts", async (req, res, next) => {
    try {
        if (req.file == null) {
            return res.status(400).send("An image is missing, please upload one.");
        }
        const userData: UserData = ((req as any).user as UserData);
        const creationPostDto: CreationPostDto = new CreationPostDto(req.body);
        const postDto: PostDto = await PostController.createPost(userData.id, req.file.path, creationPostDto);
        return res.send(postDto);
    } catch (error) {
        next(error);
    }
});


router.put("/v1/posts/:id", verifyJWT_MW);
router.put("/v1/posts/:id", PostController.validate("updatePost"), validator);
router.put("/v1/posts/:id", async (req, res, next) => {
    try {
        const postId: string = req.params.id;
        const userData: UserData = ((req as any).user as UserData);
        if (!(await PostController.isUserCreator(postId, userData.id)) && userData.role !== "admin") {
            return res.status(401).send(`You are not allowed to do this action or Post with id "${postId}" was not found.`);
        }
        const updatePostDto: UpdatePostDto = new UpdatePostDto(req.body);
        const postDto: PostDto | null = await PostController.updatePost(userData.id, postId, updatePostDto);
        return res.send(postDto);
    } catch (error) {
        next(error);
    }
});

router.delete("/v1/posts/:id", verifyJWT_MW);
router.delete("/v1/posts/:id", async (req, res, next) => {
    try {
        const postId: string = req.params.id;
        const userData: UserData = ((req as any).user as UserData);
        if (!(await PostController.isUserCreator(postId, userData.id)) && userData.role !== "admin") {
            return res.status(401).send(`You are not allowed to do this action or Post with id "${postId}" was not found.`);
        }
        await PostController.deletePost(userData.id, postId);
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
});

router.post("/v1/posts/:id/like", verifyJWT_MW);
router.post("/v1/posts/:id/like", async (req, res, next) => {
    try {
        const postId: string = req.params.id;
        const userData: UserData = ((req as any).user as UserData);
        await PostController.likePost(userData.id, postId);
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
});

router.post("/v1/posts/:id/unlike", verifyJWT_MW);
router.post("/v1/posts/:id/unlike", async (req, res, next) => {
    try {
        const postId: string = req.params.id;
        const userData: UserData = ((req as any).user as UserData);
        await PostController.unlikePost(userData.id, postId);
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export const PostRoute = router;