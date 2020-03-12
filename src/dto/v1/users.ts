import { IUser } from "../../models/v1/users";
import { body } from "express-validator"
import { ValidationChain } from "express-validator";

/* UserCreation */

export class UserDto {
    public id: IUser["_id"];
    public username: IUser["username"];
    public email: IUser["email"];
    public image: IUser["image"];
    public description: string;
    public firstName: IUser["firstName"];
    public lastName: IUser["lastName"];
    public role: IUser["role"];
    public signedUp: IUser["signedUp"];
    public posts: IUser["posts"];
    public followers: IUser["followers"];
    public following: IUser["following"];

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
        this.posts = user?.posts;
        this.followers = user?.followers;
        this.following = user?.following;
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
        body("email", "Email is not an email").exists().withMessage("Email is missing").normalizeEmail().isEmail(),
        body("firstName", "First Name is missing").notEmpty(),
        body("lastName", "Last Name is missing").notEmpty(),
        body("birthday", "Birthday is missing").notEmpty()
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
        body("email", "Email is not an email").exists().withMessage("Email is missing").normalizeEmail().isEmail(),
        body("password", "Password is missing").exists()
    ];
}

/* *** */