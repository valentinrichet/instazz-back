import jwt from "jsonwebtoken";
import Environment from "./environment";

export async function verifyJWTToken(token: string): Promise<any> {
    try {
        const decodedToken: any = await jwt.verify(token, Environment.jwtSecret);

        if (!decodedToken) {
            throw new Error("Problem while decoding the token");
        }

        return decodedToken;
    } catch (err) {
        console.error(`Problem while decoding the token: ${token}`);
        throw err;
    }
}

export function createJWToken(details: any) {
    const reduce: any = require("lodash.reduce");

    if (typeof details !== "object") {
        details = {};
    }

    if (!details.maxAge || typeof details.maxAge !== "number") {
        details.maxAge = 3600;
    }

    details.sessionData = reduce(
        details.sessionData || {},
        (result: [any], val: any, key: any) => {
            if (typeof val !== "function" && key !== "password") {
                result[key] = val;
            }
            return result;
        },
        {}
    );

    let token = jwt.sign(
        {
            data: details.sessionData
        },
        Environment.jwtSecret,
        {
            expiresIn: details.maxAge,
            algorithm: "HS256"
        }
    );

    return token;
}