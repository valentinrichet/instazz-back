import { UserCreationDto, userCreationDtoRules, UserDto, UserFollowDto, userFollowDtoRules, UserSignInDto, userSignInDtoRules, UserUpdateDto, userUpdateDtoRules, UserFollowingAndFollowerDto } from "../../dto/v1/users";
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
        case "followUser": {
            return userFollowDtoRules();
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
    if (user != null) {
        await user.populate([
            {
                path: "followers",
                select: "_id username firstName lastName image",
                options:
                {
                    limit: 10
                }
            },
            {
                path: "following",
                select: "_id username firstName lastName image",
                options:
                {
                    limit: 10
                }
            },
            {
                path: "posts",
                select: "_id content",
                options:
                {
                    limit: 20,
                    sort: { created: -1 }
                }
            }
        ]).execPopulate();
    }
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

async function follow(id: string, userFollowDto: UserFollowDto): Promise<void> {
    await Promise.all([User.findByIdAndUpdate(id, { $addToSet: { following: userFollowDto.id } }), User.findByIdAndUpdate(userFollowDto.id, { $addToSet: { followers: id } })]);
}

async function unfollow(id: string, unfollowId: string): Promise<void> {
    await Promise.all([User.findByIdAndUpdate(id, { $pull: { following: unfollowId } }), User.findByIdAndUpdate(unfollowId, { $pull: { followers: id } })]);
}

async function getFollowers(id: string, page: string): Promise<UserFollowingAndFollowerDto[] | null> {
    const limit: number = 10;
    const start: number = (parseInt(page) - 1) * limit;
    const user = await User.findById(id).populate({
        path: "followers",
        select: "_id username firstName lastName image",
        options:
        {
            start: start,
            limit: limit
        }
    });
    const userFollowers: UserFollowingAndFollowerDto[] | null = user == null ? null : user.followers.map(follower => new UserFollowingAndFollowerDto(follower));
    return userFollowers;
}

async function getFollowing(id: string, page: string): Promise<UserFollowingAndFollowerDto[] | null> {
    const limit: number = 10;
    const start: number = (parseInt(page) - 1) * limit;
    const user = await User.findById(id).populate({
        path: "following",
        select: "_id username firstName lastName image",
        options:
        {
            start: start,
            limit: limit
        }
    });
    const userFollowing: UserFollowingAndFollowerDto[] | null = user == null ? null : user.following.map(follower => new UserFollowingAndFollowerDto(follower));
    return userFollowing;
}

export default {
    getUser,
    createUser,
    updateUser,
    signIn,
    follow,
    unfollow,
    getFollowers,
    getFollowing,
    validate
};