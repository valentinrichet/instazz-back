import mongoose, { Document, Schema } from 'mongoose';

export interface Comment {
    author: string;
    content: string;
}

export interface IPost extends Document {
    title: string;
    description: string;
    tags: [string];
    content: string;
    author: string;
    created: Date;
    likedBy: [string];
    likedCount: number;
    comments: [Comment];
}

const PostSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{
        type: String,
        required: true
    }],
    content: { type: String, required: true, unique: true },
    author: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    created: { type: Date, required: true },
    likedBy: [{ type: Schema.Types.ObjectId, ref: "Users", required: true }],
    comments: [{
        author: { type: Schema.Types.ObjectId, ref: "Users", required: true },
        content: { type: String, required: true }

    }]
});

PostSchema.virtual("likedCount").get(function (this: IPost) {
    return this.likedBy.length;
});

export default mongoose.model<IPost>("Posts", PostSchema);