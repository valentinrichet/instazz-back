import { body } from "express-validator";
import { UserCreationDto, userCreationDtoRules, UserDto, UserSignInDto, userSignInDtoRules } from "../../dto/v1/users";
import { createJWToken } from "../../libs/auth";
import { hash } from "../../libs/hash";
import User, { IUser } from "../../models/v1/users";
import { UserData } from "../../types/user_data";

export interface IUserCreation {
    username: IUser["username"];
    hashedPassword: IUser["hashedPassword"];
    email: IUser["email"];
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
            return userSignInDtoRules();
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

async function createUser(userCreationDto: UserCreationDto): Promise<UserDto> {
    const { password, ...otherData } = userCreationDto;
    const userCreationData: IUserCreation = { ...otherData, hashedPassword: await hash(password), role: "user", signedUp: new Date() };
    const user: IUser = await User.create({ ...userCreationData });
    const userDto = new UserDto(user);
    return userDto;
}

async function updateUser(userUpdateData: IUserUpdate): Promise<UserDto | null> {
    const user: IUser | null = await User.findByIdAndUpdate(userUpdateData._id, userUpdateData);
    const userDto: UserDto | null = user == null ? null : new UserDto(user);
    return userDto;
}

async function getUser(id: string): Promise<UserDto | null> {
    const user: IUser | null = await User.findById(id);
    const userDto: UserDto | null = user == null ? null : new UserDto(user);
    return userDto;
};

async function signIn(userSignInDto: UserSignInDto): Promise<string | null> {
    let token: string | null = null;
    const hashedPassword: string = await hash(userSignInDto.password);
    const user: IUser | null = await User.findOne({ "email": userSignInDto.email, "hashedPassword": hashedPassword }).exec();

    if (user != null) {
        const details: { sessionData: UserData } = { sessionData: { id: user._id, role: user.role } };
        token = createJWToken(details);
    }

    return token;
};

export default {
    getUser,
    createUser,
    updateUser,
    signIn,
    validate
};