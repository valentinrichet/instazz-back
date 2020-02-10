import User, { IUser } from "../../models/v1/users";
import { hash } from "../../libs/hash"

interface IUserCreation {
    username: IUser["username"];
    hashedPassword: IUser["hashedPassword"];
    email: IUser["email"];
    description: IUser["description"];
    firstName: IUser["firstName"];
    lastName: IUser["lastName"];
    role: IUser["role"];
    signedUp: IUser["signedUp"];
}

async function createUser(userCreationData: IUserCreation & { password: string }): Promise<IUser> {
    userCreationData.description = " ";
    userCreationData.role = "user";
    userCreationData.signedUp = new Date();

    // Hashing Password
    userCreationData.hashedPassword = await hash(userCreationData.password);

    return User.create({
        ...userCreationData,
    })
        .then((data: IUser) => {
            return data;
        })
        .catch((error: Error) => {
            throw error;
        });
}

async function getUser(id: string): Promise<IUser | null> {
    return User.findById(id)
        .then((data: IUser | null) => {
            return data;
        })
        .catch((error: Error) => {
            throw error;
        });
};

async function signIn(email: string, password: string): Promise<IUser | null> {
    const hashedPassword: string = await hash(password);
    return User.findOne({ "email": email, "hashedPassword": hashedPassword }).exec()
        .then((data: IUser | null) => {
            return data;
        })
        .catch((error: Error) => {
            throw error;
        });
};

export default {
    getUser,
    createUser,
    signIn
};