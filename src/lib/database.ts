import mongoose from 'mongoose';
import { DatabaseConnectionArgs } from '../types/database';

export default ({ url, username, password, database }: DatabaseConnectionArgs) => {
    const connect = () => {
        mongoose.connect(url, { dbName: database, user: username, pass: password, useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                return console.info(`Successfully connected to ${url}`);
            })
            .catch(error => {
                console.error("Error connecting to database: ", error);
                return process.exit(1);
            });
    };
    connect();
    mongoose.connection.on("disconnected", connect);
};