import express, { Express, NextFunction, Request, Response } from "express";
import { Environment } from "./lib/environment";
import { UserRoute } from "./routes/users";

const app: Express = express();

app.use("/users", UserRoute);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "hello wooooorllllld" });
});

app.listen(Environment.port, () => {
    console.log(`Listening on port ${Environment.port}`);
});
