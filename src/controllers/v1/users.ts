import User, { IUser } from "../../models/v1/users";
import { body } from "express-validator"
import { hash } from "../../libs/hash"
import { exists } from "fs";
import { UserCreationDto, userCreationDtoRules } from "../../dto/v1/users";

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

interface IUserUpdate {
    _id: IUser["id"];
    email: IUser["email"];
    description: IUser["description"];
}

function validate(method: string, isAdmin?: boolean): any {
    if (isAdmin === true) {
        return [];
    }

    switch (method) {
        case "createUser": {
            return userCreationDtoRules();
        }
        case "signIn": {
            return [
                // IUser
                body("email", "Email is not an email").exists().withMessage("Email is missing").normalizeEmail().isEmail(),
                // Other
                body("password", "Password is missing").exists()
            ]
        }
        case "updateUser": {
            return [
                // IUser
                body("username", "Username should not be specified").not().exists(),
                body("hashedPassword", "Hashed Password should not be specified").not().exists(),
                body("email", "Email is not an email").exists().withMessage("Email is missing").normalizeEmail().isEmail(),
                body("description", "Description is missing").notEmpty(),
                body("firstName", "First Name is missing").notEmpty(),
                body("lastName", "Last Name is missing").notEmpty(),
                body("role", "Role should not be specified").not().exists(),
                body("birthday", "Birthday is missing").notEmpty(),
                body("signedUp", "Signed Up should not be specified").not().exists(),
                body("images", "Images should not be specified").not().exists(),
                body("followers", "Followers should not be specified").not().exists(),
                body("following", "Following should not be specified").not().exists(),
            ]
        }
    }
}

async function createUser(userCreationDto: UserCreationDto): Promise<IUser> {
    const { password, ...otherData } = userCreationDto;
    const userCreationData: IUserCreation = { ...otherData, hashedPassword: await hash(password), description: " ", role: "user", signedUp: new Date() };
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
    signIn,
    validate
};