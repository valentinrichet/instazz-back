import { UserCreationDto, userCreationDtoRules, UserDto, UserFollowDto, userFollowDtoRules, UserFollowingAndFollowerDto, UserPostDto, UserSignInDto, userSignInDtoRules, UserUpdateDto, userUpdateDtoRules } from "../../dto/v1/users";
import { createJWToken } from "../../libs/auth";
import Environment from "../../libs/environment";
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
    let user: IUser | null = null;
    let userDto: UserDto | null = null;
    const { password, ...otherData } = userUpdateDto;
    const userUpdate: IUserUpdate = { ...otherData };
    if (password != null) {
        userUpdate.hashedPassword = await hash(password);
    }
    try {
        user = await User.findByIdAndUpdate(id, userUpdate, { new: true });
    } finally {
        userDto = user == null ? null : new UserDto(user);
    }
    return userDto;
}

async function getUser(id: string): Promise<UserDto | null> {
    let user: IUser | null = null;
    let userDto: UserDto | null = null;
    try {
        user = await User.findById(id).populate([
            {
                path: "followers",
                select: UserFollowingAndFollowerDto.select,
                options:
                {
                    limit: Environment.queryLimit
                }
            },
            {
                path: "following",
                select: UserFollowingAndFollowerDto.select,
                options:
                {
                    limit: Environment.queryLimit
                }
            },
            {
                path: "posts",
                select: UserPostDto.select,
                options:
                {
                    limit: Environment.queryLimit,
                }
            }
        ]);
    } finally {
        userDto = user == null ? null : new UserDto(user);
    }
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
    let user: IUser | null = null;
    let userFollowersDto: UserFollowingAndFollowerDto[] | null = null;
    try {
        const skip: number = (parseInt(page) - 1) * Environment.queryLimit;
        user = await User.findById(id).populate({
            path: "followers",
            select: UserFollowingAndFollowerDto.select,
            options:
            {
                skip: skip,
                limit: Environment.queryLimit
            }
        });
    } finally {
        userFollowersDto = user == null ? null : user.followers.map(follower => new UserFollowingAndFollowerDto(follower));
    }
    return userFollowersDto;
}

async function getFollowing(id: string, page: string): Promise<UserFollowingAndFollowerDto[] | null> {
    let user: IUser | null = null;
    let userFollowingDto: UserFollowingAndFollowerDto[] | null = null;
    try {
        const skip: number = (parseInt(page) - 1) * Environment.queryLimit;
        user = await User.findById(id).populate({
            path: "following",
            select: UserFollowingAndFollowerDto.select,
            options:
            {
                skip: skip,
                limit: Environment.queryLimit
            }
        });
    } finally {
        userFollowingDto = user == null ? null : user.following.map(follow => new UserFollowingAndFollowerDto(follow));
    }
    return userFollowingDto;
}

async function getPosts(id: string, page: string): Promise<UserPostDto[] | null> {
    let user: IUser | null = null;
    let userPostsDto: UserPostDto[] | null = null;
    try {
        const skip: number = (parseInt(page) - 1) * Environment.queryLimit;
        user = await User.findById(id).populate({
            path: "posts",
            select: UserPostDto.select,
            options:
            {
                skip: skip,
                limit: Environment.queryLimit
            }
        });
    } finally {
        userPostsDto = user == null ? null : user.posts.map(post => new UserPostDto(post));
    }
    return userPostsDto;
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
    getPosts,
    validate
};