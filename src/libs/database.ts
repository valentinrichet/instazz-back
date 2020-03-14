import mongoose from 'mongoose';
import { DatabaseConnectionArgs } from '../types/database';

export default ({ url, username, password, database }: DatabaseConnectionArgs) => {
    const connect: () => void = async () => {
        try {
            await mongoose.connect(url, { dbName: database, user: username, pass: password, useNewUrlParser: true, useUnifiedTopology: true })
            console.info(`Successfully connected to ${url}`);
        } catch (exception) {
            console.error("Error connecting to database: ", exception);
            process.exit(1);
        }
    };
    connect();
    mongoose.connection.on("disconnected", connect);
};