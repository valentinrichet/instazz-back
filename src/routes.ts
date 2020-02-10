import express, { Router } from "express";
import { TagRoute } from "./routes/v1/tags";
import { UserRoute } from "./routes/v1/users";

const router: Router = express.Router();

router.use(UserRoute);
router.use(TagRoute);

export const Routes = router;
