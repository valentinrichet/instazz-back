import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  hashedPassword: string;
  email: string;
  image: string;
  description: string;
  firstName: string;
  lastName: string;
  role: string;
  signedUp: Date;
  posts: [any];
  followers: [any];
  following: [any];
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  description: { type: String },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: {
    type: String, enum: ["user", "admin"],
    default: "user", required: true
  },
  signedUp: { type: Date, required: true },
  posts: [{
    type: Schema.Types.ObjectId,
    ref: "Posts",
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

const autoPopulate = function (next: any) {
  const populateQuery: any = [
    {
      path: "followers", select: "_id firstName lastName image"
    },
    {
      path: "following", select: "_id firstName lastName image"
    },
    {
      path: "posts",
      options:
      {
        limit: 20,
        sort: { created: -1 }
      },
      select: "_id content"
    }
  ];
  this.populate(populateQuery);
  next();
};

UserSchema.pre("findOne", autoPopulate);
UserSchema.pre("find", autoPopulate);
export default mongoose.model<IUser>("Users", UserSchema);