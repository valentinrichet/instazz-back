import { IUser } from "../../models/v1/users";
import { body } from "express-validator"
import { ValidationChain } from "express-validator";

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