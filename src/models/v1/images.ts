import mongoose, { Schema, Document } from 'mongoose';

export interface Comment {
    author: string;
    content: string;
}

export interface IImage extends Document {
    title: string;
    description: string;
    tags: [string];
    content: string;
    author: string;
    date: Date;
    likedBy: [string];
    comments: [Comment];
}



const ImageSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: "Tags",
        required: true
    }],
    content: { type: String, required: true, unique: true },
    author: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    date: { type: Date, default: Date.now },
    likedBy: [{ type: Schema.Types.ObjectId, ref: "Users", required: true }],
    comments: [{
        author: { type: Schema.Types.ObjectId, ref: "Users", required: true },
        content: { type: String, required: true }
        
    }]
});

export default mongoose.model<IImage>("Images", ImageSchema);