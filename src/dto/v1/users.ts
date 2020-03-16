import { body, ValidationChain } from "express-validator";
import { IPost } from "../../models/v1/posts";
import { IUser } from "../../models/v1/users";

/* UserCreation */

export class UserDto {
    public id: IUser["_id"];
    public username: IUser["username"];
    public email: IUser["email"];
    public image: string;
    public description: string;
    public firstName: IUser["firstName"];
    public lastName: IUser["lastName"];
    public role: IUser["role"];
    public signedUp: IUser["signedUp"];
    public posts: UserPostDto[];
    public followers: UserFollowingAndFollowerDto[];
    public following: UserFollowingAndFollowerDto[];

    public constructor(user: IUser) {
        this.id = user?._id;
        this.username = user?.username;
        this.email = user?.email;
        this.image = user?.image;
        this.description = user?.description;
        this.firstName = user?.firstName;
        this.lastName = user?.lastName;
        this.role = user?.role;
        this.signedUp = user?.signedUp;
        this.posts = user?.posts == null ? [] : user.posts.map(post => new UserPostDto(post));
        this.followers = user?.followers == null ? [] : user.followers.map(follower => new UserFollowingAndFollowerDto(follower));
        this.following = user?.following == null ? [] : user.following.map(follow => new UserFollowingAndFollowerDto(follow));
    }
}

/* *** */

/* UserCreation */

export class UserCreationDto {
    public username: IUser["username"];
    public email: IUser["email"];
    public password: string;
    public firstName: IUser["firstName"];
    public lastName: IUser["lastName"];

    public constructor(json: any) {
        this.username = json?.username;
        this.email = json?.email;
        this.password = json?.password;
        this.firstName = json?.firstName;
        this.lastName = json?.lastName;
    }
}

export function userCreationDtoRules(): ValidationChain[] {
    return [
        body("username", "Username is missing").notEmpty(),
        body("password", "Password must be 6 character long").isLength({ min: 6 }),
        body("email", "Email is not an email").exists().withMessage("Email is missing").isEmail(),
        body("firstName", "First Name is missing").notEmpty(),
        body("lastName", "Last Name is missing").notEmpty()
    ];
}

/* *** */

/* UserUpdateDto */

export class UserUpdateDto {
    public username?: IUser["username"];
    public password?: string;
    public email?: IUser["email"];
    public image?: IUser["image"];
    public description?: IUser["description"];
    public firstName?: IUser["firstName"];
    public lastName?: IUser["lastName"];
    public role?: IUser["role"];

    public constructor(json: any, image?: string) {
        if (json != null) {
            if (json.username != null) {
                this.username = json.username;
            }
            if (json.password != null) {
                this.password = json.password;
            }
            if (json.email != null) {
                this.email = json.email;
            }
            if (image != null) {
                this.image = image;
            }
            if (json.description !== undefined) {
                this.description = json.description;
            }
            if (json.firstName != null) {
                this.firstName = json.firstName;
            }
            if (json.lastName != null) {
                this.lastName = json.lastName;
            }
            if (json.role != null) {
                this.role = json.role;
            }
        }
    }
}

export function userUpdateDtoRules(): ValidationChain[] {
    return [
        body("username", "Username is missing").optional().notEmpty(),
        body("password", "Password must be 6 character long").optional().isLength({ min: 6 }),
        body("email", "Email is not an email").optional().isEmail(),
        body("description").optional(),
        body("firstName", "First Name is missing").optional().notEmpty(),
        body("lastName", "Last Name is missing").optional().notEmpty(),
        body("role", "Role must be \"user\" or \"admin\"").optional().if((value: any, { req }: any) => req.user?.role === "admin").matches(/\b(?:user|admin)\b/)
    ];
}

/* *** */

/* UserSignIn */

export class UserSignInDto {
    public email: IUser["email"];
    public password: string;

    public constructor(json: any) {
        this.email = json?.email;
        this.password = json?.password;
    }
}

export function userSignInDtoRules(): ValidationChain[] {
    return [
        body("email", "Email is not an email").exists().withMessage("Email is missing").isEmail(),
        body("password", "Password is missing").exists()
    ];
}

/* *** */

/* UserFollowDto */

export class UserFollowDto {
    public id: IUser["_id"];

    public constructor(json: any) {
        this.id = json?.id;
    }
}

export function userFollowDtoRules(): ValidationChain[] {
    return [
        body("id", "Email is not an email").isMongoId()
    ];
}

/* *** */

/* UserFollowDto */

export class UserFollowingAndFollowerDto {
    public id: IUser["_id"];
    public username: IUser["username"];
    public firstName: IUser["firstName"];
    public lastName: IUser["lastName"];
    public image: IUser["image"];

    public constructor(json: IUser) {
        this.id = json?._id;
        this.username = json?.username;
        this.firstName = json?.firstName;
        this.lastName = json?.lastName;
        this.image = json?.image;
    }

    public static get select(): string {
        return "_id username firstName lastName image";
    }
}

/* *** */

/* UserPostDto */

export class UserPostDto {
    public id: IPost["_id"];
    public content: IPost["content"];
    public likedCount: IPost["likedCount"];

    public constructor(json: IPost) {
        this.id = json?._id;
        this.content = json?.content;
        this.likedCount = json?.likedCount;
    }

    public static get select(): string {
        return "_id content likedBy likedCount";
    }
}

/* *** */