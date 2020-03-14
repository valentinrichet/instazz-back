import { postCreationDtoRules, PostDto, postUpdateDtoRules, CreationPostDto } from '../../dto/v1/posts';
import Post, { IPost } from '../../models/v1/posts';

export interface IPostCreation {
    title: IPost["title"];
    description: IPost["description"];
    tags?: IPost["tags"];
    content: IPost["content"];
    author: IPost["author"];
    created: IPost["created"];
}

export interface IPostUpdate {
    title?: IPost["title"];
    description?: IPost["description"];
    tags?: IPost["tags"];
}

function validate(method: string): any {
    switch (method) {
        case "createPost": {
            return postCreationDtoRules();
        }
        case "updatePost": {
            return postUpdateDtoRules();
        }
        default: {
            return [];
        }
    }
}

async function getPosts(): Promise<PostDto[]> {
    const posts: IPost[] = await Post.find({});
    const postsDto: PostDto[] = posts.map(post => new PostDto(post));
    return postsDto;
};


async function getPost(id: string): Promise<PostDto | null> {
    let post: IPost | null = null;
    let postDto: PostDto | null = null;
    try {
        post = await Post.findById(id);
    } finally {
        postDto = post == null ? null : new PostDto(post);
    }
    return postDto;
};

async function createPost(userId: string, content: string, creationPostDto: CreationPostDto): Promise<PostDto> {
    const postCreation: IPostCreation = { ...creationPostDto, content: content, author: userId, created: new Date() };
    const post: IPost = await Post.create({ ...postCreation });
    const postDto: PostDto = new PostDto(post);
    return postDto;
}

/*
async function updatePost(id: string, updateTagDto: UpdateTagDto): Promise<TagDto | null> {
    let tag: ITag | null = null;
    let tagDto: TagDto | null = null;
    const tagCreationAndUpdate: ITagUpdate = updateTagDto;
    try {
        tag = await Tag.findByIdAndUpdate(id, tagCreationAndUpdate, { new: true });
    } finally {
        tagDto = tag == null ? null : new TagDto(tag);
    }
    return tagDto;
}

async function deletePost(id: string): Promise<boolean> {
    const wasDeleted: boolean = (await Tag.findByIdAndDelete(id)) != null;
    return wasDeleted;
};*/

export default {
    getPosts,
    getPost,
    createPost,
    validate
};