import express, { Router } from "express";
import TagController from "../../controllers/v1/tags";
import { ITag } from "../../models/v1/tags";

const router: Router = express.Router();

router.get("/v1/tags", async (req, res) => {
    try {
        const tags: ITag[] = await TagController.getTags();
        return res.send(tags);
    } catch (error) {
        console.error(error);
        return res.status(400).send("Something went wrong, please retry");
    }
});

router.get("/v1/tags/:id", async (req, res) => {
    try {
        const tag: ITag | null = await TagController.getTag(req.params.id);
        if (tag == null) {
            return res.status(404).send("Not found");
        }
        return res.send(tag);
    } catch (error) {
        console.error(error);
        return res.status(400).send("Something went wrong, please retry");
    }
});

router.post("/v1/tags", async (req, res) => {
    try {
        const tag: ITag = await TagController.createTag(req.body);
        return res.send(tag);
    } catch (error) {
        console.error(error);
        return res.status(400).send("Malformed request payload");
    }
});

router.put("/v1/tags/:id", async (req, res) => {
    try {
        if (req.body.id !== req.params.id) {
            return res.status(400).send("Malformed request payload");
        }

        const tag: ITag | null = await TagController.updateTag(req.body);

        if (tag == null) {
            return res.status(404).send("Not found");
        }

        return res.send(tag);
    } catch (error) {
        console.error(error);
        return res.status(400).send("Malformed request payload");
    }
});

router.delete("/v1/tags/:id", async (req, res) => {
    try {
        const result: boolean = await TagController.deleteTagById(req.params.id);

        return result ? res.send(true) : res.status(400).send(false);
    } catch (error) {
        console.error(error);
        return res.status(400).send("Malformed request payload");
    }
});

export const TagRoute = router;