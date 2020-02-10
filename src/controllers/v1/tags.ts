import Tag, { ITag } from '../../models/v1/tags';

async function getTags(): Promise<ITag[]> {
    return Tag.find({})
        .then((data: ITag[]) => {
            return data;
        })
        .catch((error: Error) => {
            throw error;
        });
};

async function getTag(id: string): Promise<ITag | null> {
    return Tag.findById(id)
        .then((data: ITag | null) => {
            return data;
        })
        .catch((error: Error) => {
            throw error;
        });
};

async function createTag(tag: ITag): Promise<ITag> {
    return Tag.create({ ...tag })
        .then((data: ITag) => {
            return data;
        })
        .catch((error: Error) => {
            throw error;
        });
}

async function updateTag(tag: ITag): Promise<ITag | null> {
    return Tag.findByIdAndUpdate(tag.id, tag)
        .then((data: ITag | null) => {
            return data;
        })
        .catch((error: Error) => {
            throw error;
        });
}

async function deleteTag(tag: ITag): Promise<boolean> {
    return deleteTagById(tag.id);
};

async function deleteTagById(id: string): Promise<boolean> {
    return Tag.findByIdAndDelete(id)
        .then((data: ITag | null) => {
            return data != null;
        })
        .catch((error: Error) => {
            throw error;
        });
};

export default {
    getTags,
    getTag,
    createTag,
    updateTag,
    deleteTag,
    deleteTagById
};