import { Request, Response, NextFunction } from "express"

export default ({ error, request, response, next }: { error: any, request: Request, response: Response, next: NextFunction }) => {
    if (error != null) {
        console.error(error.message)

        if (error.name === "CastError" && error.kind === "ObjectId") {
            return response.status(400).send("malformatted id");
        }

        if (error.message != null) {
            return response.status(500).send(error.message);
        }
    }

    next(error)
};