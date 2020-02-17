import User, { IUser } from "../../models/v1/users";
import { hash } from "../../libs/hash"

export interface IUserCreation {
    username: IUser["username"];
    hashedPassword: IUser["hashedPassword"];
    email: IUser["email"];
    description: IUser["description"];
    firstName: IUser["firstName"];
    lastName: IUser["lastName"];
    role: IUser["role"];
    signedUp: IUser["signedUp"];
}

export interface IUserUpdate {
    _id: IUser["id"];
    email: IUser["email"];
    description: IUser["description"];
}

async function createUser(userCreationData: IUserCreation & { password: string }): Promise<IUser> {
    userCreationData.description = " ";
    userCreationData.role = "user";
    userCreationData.signedUp = new Date();
    userCreationData.hashedPassword = await hash(userCreationData.password);

    return await User.create({ ...userCreationData });
}

async function updateUser(userUpdateData: IUserUpdate) {
    return await User.findByIdAndUpdate(userUpdateData._id, userUpdateData);
}

async function getUser(id: string): Promise<IUser | null> {
    return await User.findById(id);
};

async function signIn(email: string, password: string): Promise<IUser | null> {
    const hashedPassword: string = await hash(password);
    return await User.findOne({ "email": email, "hashedPassword": hashedPassword }).exec();
};

export default {
    getUser,
    createUser,
    updateUser,
    signIn
};