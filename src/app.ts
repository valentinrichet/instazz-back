import bodyParser from 'body-parser';
import express, { Express } from "express";
import * as winston from 'winston';
import connectToDb from './libs/database';
import Environment from "./libs/environment";
import ErrorHandler from "./middlewares/error";
import { Routes } from "./routes";
import expressWinston = require('express-winston');

const app: Express = express();

app.use(`/${Environment.uploadDirectory}`, express.static(Environment.uploadDirectory));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console({})
    ]
}));
app.use(Routes);
app.use(ErrorHandler);

app.listen(Environment.port, () => {
    console.log(`Listening on port ${Environment.port}`);
});

connectToDb(Environment.database);