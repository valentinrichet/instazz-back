import { UserCreationDto, userCreationDtoRules, UserDto, UserSignInDto, userSignInDtoRules, UserUpdateDto, userUpdateDtoRules } from "../../dto/v1/users";
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
    username?: IUser["username"];
    hashedPassword?: IUser["hashedPassword"];
    email?: IUser["email"];
    image?: IUser["image"];
    description?: IUser["description"];
    firstName?: IUser["firstName"];
    lastName?: IUser["lastName"];
    role?: IUser["role"];
}

function validate(method: string): any {
    switch (method) {
        case "createUser": {
            return userCreationDtoRules();
        }
        case "signIn": {
            return userSignInDtoRules();
        }
        case "updateUser": {
            return userUpdateDtoRules();
        }
        default: {
            return [];
        }
    }
}

async function createUser(userCreationDto: UserCreationDto): Promise<UserDto> {
    const { password, ...otherData } = userCreationDto;
    const userCreation: IUserCreation = { ...otherData, hashedPassword: await hash(password), role: "user", signedUp: new Date() };
    const user: IUser = await User.create({ ...userCreation });
    const userDto = new UserDto(user);
    return userDto;
}

async function updateUser(id: string, userUpdateDto: UserUpdateDto): Promise<UserDto | null> {
    const { password, ...otherData } = userUpdateDto;
    const userUpdate: IUserUpdate = { ...otherData };
    if (password != null) {
        userUpdate.hashedPassword = await hash(password);
    }
    const user: IUser | null = await User.findByIdAndUpdate(id, userUpdate, { new: true });
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