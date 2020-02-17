import { validationResult } from "express-validator";

export default (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors: any = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(422).send(extractedErrors);
}