import User, { IUser } from "../../models/v1/users";
import { body } from "express-validator"
import { hash } from "../../libs/hash"
import { exists } from "fs";

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
            return [
                // IUser
                body("username", "Username is missing").notEmpty(),
                body("hashedPassword", "Hashed Password should not be specified").not().exists(),
                body("email", "Email is not an email").exists().withMessage("Email is missing").normalizeEmail().isEmail(),
                body("description", "Description should not be specified").not().exists(),
                body("firstName", "First Name is missing").notEmpty(),
                body("lastName", "Last Name is missing").notEmpty(),
                body("role", "Role should not be specified").not().exists(),
                body("birthday", "Birthday is missing").notEmpty(),
                body("signedUp", "Signed Up should not be specified").not().exists(),
                body("images", "Images should not be specified").not().exists(),
                body("followers", "Followers should not be specified").not().exists(),
                body("following", "Following should not be specified").not().exists(),
                // Other
                body("password", "Password must be 6 character long").isLength({ min: 6 })
            ]
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
    signIn,
    validate
};