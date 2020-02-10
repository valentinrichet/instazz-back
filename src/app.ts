import bodyParser from 'body-parser';
import express, { Express, NextFunction, Request, Response } from "express";
import * as winston from 'winston';
import connectToDb from './libs/database';
import Environment from "./libs/environment";
import { Routes } from "./routes";
import ErrorHandler from "./middlewares/error";
import expressWinston = require('express-winston');

const app: Express = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console({})
    ]
}));
app.use(ErrorHandler);
app.use(Routes);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "hello world" });
});

app.listen(Environment.port, () => {
    console.log(`Listening on port ${Environment.port}`);
});

connectToDb(Environment.database);