import { CreationTagDto, tagCreationAndUpdateDtoRules, TagDto, UpdateTagDto } from '../../dto/v1/tags';
import Tag, { ITag } from '../../models/v1/tags';

export interface ITagCreation {
    name: ITag["name"];
}

export interface ITagUpdate {
    name: ITag["name"];
}

function validate(method: string): any {
    switch (method) {
        case "createTag": {
            return tagCreationAndUpdateDtoRules();
        }
        case "updateTag": {
            return tagCreationAndUpdateDtoRules();
        }
        default: {
            return [];
        }
    }
}

async function getTags(): Promise<TagDto[]> {
    const tags: ITag[] = await Tag.find({});
    const tagsDto: TagDto[] = tags.map(tag => new TagDto(tag));
    return tagsDto;
};

async function getTag(id: string): Promise<TagDto | null> {
    const tag: ITag | null = await Tag.findById(id);
    const tagDto: TagDto | null = tag == null ? null : new TagDto(tag);
    return tagDto;
};

async function createTag(creationTagDto: CreationTagDto): Promise<TagDto> {
    const tagCreationAndUpdate: ITagCreation = creationTagDto;
    const tag: ITag = await Tag.create({ ...tagCreationAndUpdate });
    const tagDto: TagDto = new TagDto(tag);
    return tagDto;
}

async function updateTag(id: string, updateTagDto: UpdateTagDto): Promise<TagDto | null> {
    const tagCreationAndUpdate: ITagUpdate = updateTagDto;
    const tag: ITag | null = await Tag.findByIdAndUpdate(id, tagCreationAndUpdate, { new: true });
    const tagDto: TagDto | null = tag == null ? null : new TagDto(tag);
    return tagDto;
}

async function deleteTag(id: string): Promise<boolean> {
    const wasDeleted: boolean = (await Tag.findByIdAndDelete(id)) != null;
    return wasDeleted;
};

export default {
    getTags,
    getTag,
    createTag,
    updateTag,
    deleteTag,
    validate
};