import Tag, { ITag } from '../../models/v1/tags';

async function getTags(): Promise<ITag[]> {
    return await Tag.find({});
};

async function getTag(id: string): Promise<ITag | null> {
    return await Tag.findById(id);
};

async function createTag(tag: ITag): Promise<ITag> {
    return await Tag.create({ ...tag });
}

async function updateTag(tag: ITag): Promise<ITag | null> {
    return await Tag.findByIdAndUpdate(tag.id, tag);
}

async function deleteTag(tag: ITag): Promise<boolean> {
    return await deleteTagById(tag.id);
};

async function deleteTagById(id: string): Promise<boolean> {
    return (await Tag.findByIdAndDelete(id)) != null;
};

export default {
    getTags,
    getTag,
    createTag,
    updateTag,
    deleteTag,
    deleteTagById
};