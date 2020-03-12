import { NextFunction, Request, Response } from "express";

export default async function (error: any, request: Request, response: Response, next: NextFunction) {
    if (error != null) {
        console.error(error);
        if (error.keyValue != null) {
            const extractedErrors: any[] = [];
            if (error.keyValue.email != null) {
                extractedErrors.push({ "email": `The mail "${error.keyValue.email}" is already in use` });
            }
            if (error.keyValue.username != null) {
                extractedErrors.push({ "username": `The username "${error.keyValue.username}" is already in use` });
            }
            if (error.keyValue.name != null) {
                extractedErrors.push({ "name": `The name "${error.keyValue.name}" is already in use` });
            }
            if (extractedErrors.length > 0) {
                return response.status(422).send(extractedErrors);
            }
        }
        return response.status(500).send("There was an issue with the server, please try later...");
    }
    return next();
};