import { CreationPostDto, postCreationDtoRules, PostDto, postUpdateDtoRules, UpdatePostDto } from '../../dto/v1/posts';
import Post, { IPost } from '../../models/v1/posts';
import User from '../../models/v1/users';

export interface IPostCreation {
    title: IPost["title"];
    description: IPost["description"];
    tags?: IPost["tags"];
    content: IPost["content"];
    likedCount: IPost["likedCount"];
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

async function getPosts(userId: string): Promise<PostDto[]> {
    const posts: IPost[] = await Post.find({});
    const postsDto: PostDto[] = posts.map(post => new PostDto(post, userId));
    return postsDto;
};

async function getPost(userId: string, postId: string): Promise<PostDto | null> {
    let post: IPost | null = null;
    let postDto: PostDto | null = null;
    try {
        post = await Post.findById(postId);
    } finally {
        postDto = post == null ? null : new PostDto(post, userId);
    }
    return postDto;
};

async function createPost(userId: string, content: string, creationPostDto: CreationPostDto): Promise<PostDto> {
    const postCreation: IPostCreation = { ...creationPostDto, content: content, author: userId, created: new Date(), likedCount: 0 };
    const post: IPost = await Post.create({ ...postCreation });
    const postDto: PostDto = new PostDto(post);
    await User.findByIdAndUpdate(userId, { $addToSet: { posts: post._id } });
    return postDto;
}

async function updatePost(userId: string, postId: string, updatePostDto: UpdatePostDto): Promise<PostDto | null> {
    let post: IPost | null = null;
    let postDto: PostDto | null = null;
    const postUpdate: IPostUpdate = updatePostDto;
    try {
        post = await Post.findByIdAndUpdate(postId, postUpdate, { new: true });
    } finally {
        postDto = post == null ? null : new PostDto(post, userId);
    }
    return postDto;
}

async function deletePost(userId: string, postId: string): Promise<boolean> {
    const wasDeletedInUser: boolean = (await User.findByIdAndUpdate(userId, { $pull: { posts: postId } })) != null;
    const wasDeletedInPost: boolean = (await Post.findByIdAndDelete(postId)) != null;
    return wasDeletedInUser && wasDeletedInPost;
};

async function likePost(userId: string, postId: string): Promise<void> {
    await Post.findByIdAndUpdate(postId, { $addToSet: { likedBy: userId } });
}

async function unlikePost(userId: string, postId: string): Promise<void> {
    await Post.findByIdAndUpdate(postId, { $pull: { likedBy: userId } });
}

async function isUserCreator(postId: string, postUser: string): Promise<boolean> {
    return (await Post.findById({ "_id": postId, "author": postUser }).exec()) != null;
}

export default {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    isUserCreator,
    likePost,
    unlikePost,
    validate
};