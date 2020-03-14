import express, { Router } from "express";
import { PostRoute } from "./routes/v1/posts";
import { TagRoute } from "./routes/v1/tags";
import { UserRoute } from "./routes/v1/users";

const router: Router = express.Router();

router.use(UserRoute);
router.use(TagRoute);
router.use(PostRoute);

export const Routes = router;
