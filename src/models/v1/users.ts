import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  hashedPassword: string;
  email: string;
  description: string;
  firstName: string;
  lastName: string;
  role: string;
  birthday: Date;
  signedUp: Date;
  images: [string];
  followers: [string];
  following: [string];
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, required: true },
  birthday: Date,
  signedUp: { type: Date, required: true },
  images: [{
    type: Schema.Types.ObjectId,
    ref: "Images",
    required: true
  }],
  followers: [{
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true
  }],
  following: [{
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true
  }],
});

export default mongoose.model<IUser>("Users", UserSchema);