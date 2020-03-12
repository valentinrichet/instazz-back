import express, { Router } from "express";
import TagController from "../../controllers/v1/tags";
import { CreationTagDto, TagDto, UpdateTagDto } from "../../dto/v1/tags";
import validator from "../../middlewares/validator";

const router: Router = express.Router();

router.get("/v1/tags", async (req, res, next) => {
    try {
        const tags: TagDto[] = await TagController.getTags();
        return res.send(tags);
    } catch (error) {
        next(error);
    }
});

router.get("/v1/tags/:id", async (req, res, next) => {
    try {

        const tagId: string = req.params.id;
        const tag: TagDto | null = await TagController.getTag(tagId);
        if (tag == null) {
            return res.status(404).send(`Tag with id "${tagId}" wasn't found`);
        }
        return res.send(tag);
    } catch (error) {
        next(error);
    }
});

router.post("/v1/tags", TagController.validate("createTag"), validator);
router.post("/v1/tags", async (req, res, next) => {
    try {
        const creationTagDto: CreationTagDto = new CreationTagDto(req.body)
        const tag: TagDto = await TagController.createTag(creationTagDto);
        return res.send(tag);
    } catch (error) {
        next(error);
    }
});

router.put("/v1/tags/:id", TagController.validate("updateTag"), validator);
router.put("/v1/tags/:id", async (req, res, next) => {
    try {
        const tagId: string = req.params.id;
        const updateTagDto: UpdateTagDto = new UpdateTagDto(req.body)
        const tag: TagDto | null = await TagController.updateTag(tagId, updateTagDto);
        if (tag == null) {
            return res.status(404).send(`Tag with id "${tagId}" wasn't found`);
        }
        return res.send(tag);
    } catch (error) {
        next(error);
    }
});

router.delete("/v1/tags/:id", async (req, res, next) => {
    try {
        const tagId: string = req.params.id;
        await TagController.deleteTag(tagId);
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export const TagRoute = router;