import { body, ValidationChain } from "express-validator";
import { IPost } from "../../models/v1/posts";


/* PostDto */

export class PostDto {
    public id: IPost["_id"];
    public title: IPost["title"];
    public description: IPost["description"];
    public tags: IPost["tags"];
    public content: IPost["content"];
    public author: IPost["author"];
    public created: IPost["created"];
    public likedBy: IPost["likedBy"];
    public likedByCount: IPost["likedByCount"];
    public comments: IPost["comments"];

    public constructor(post: IPost) {
        this.id = post?._id;
        this.title = post?.title;
        this.description = post?.description;
        this.tags = post?.tags;
        this.content = post?.content;
        this.author = post?.author;
        this.created = post?.created;
        this.likedBy = post?.likedBy;
        this.likedByCount = post?.likedByCount;
        this.comments = post?.comments;
    }
}

/* *** */

/* CreationPostDto */

export class CreationPostDto {
    public title: IPost["title"];
    public description: IPost["description"];
    public tags?: IPost["tags"];

    public constructor(json: any) {
        this.title = json?.title;
        this.description = json?.description;
        if (json.tags != null) {
            this.tags = json.tags;
        }
    }
}

export function postCreationDtoRules(): ValidationChain[] {
    return [
        body("title", "Title is missing").notEmpty(),
        body("description", "Description is missing").notEmpty(),
        body("tags", "Tags should be an array").optional().isArray()
    ];
}

/* *** */

/* UpdatePostDto */

export class UpdatePostDto {
    public title?: IPost["title"];
    public description?: IPost["description"];
    public tags?: IPost["tags"];

    public constructor(json: any) {
        if (json != null) {
            if (json.title != null) {
                this.title = json.title;
            }
            if (json.description != null) {
                this.description = json.description;
            }
            if (json.tags != null) {
                this.tags = json.tags;
            }
        }
    }
}

export function postUpdateDtoRules(): ValidationChain[] {
    return [
        body("title", "Title is missing").optional().notEmpty(),
        body("description", "Description is missing").optional().notEmpty(),
        body("tags", "Tags should be an array").optional().isArray()
    ];
}

/* *** */