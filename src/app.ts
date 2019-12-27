import bodyParser from 'body-parser';
import express, { Express, NextFunction, Request, Response } from "express";
import connectToDb from './lib/database';
import Environment from "./lib/environment";
import { UserRoute } from "./routes/users";

const app: Express = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/users", UserRoute);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "hello world" });
});

app.listen(Environment.port, () => {
    console.log(`Listening on port ${Environment.port}`);
});

connectToDb(Environment.database);