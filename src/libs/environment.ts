import { config } from "dotenv";
import { resolve } from "path";
import { DatabaseConnectionArgs } from "../types/database";

const environment: string = (process.env.NODE_ENV || "development").trim();
config({ path: resolve(__dirname, `../../env/${environment}.env`) });

export default {
    port: parseInt(process.env.port || "0"),
    database: {
        url: process.env.database_url || "",
        database: process.env.database_database || "",
        username: process.env.database_username || "",
        password: process.env.database_password || ""
    },
    jwtSecret: process.env.jwt_secret || "",
    salt: process.env.salt || "",
    uploadDirectory: process.env.upload_directory || "uploads",
    queryLimit: parseInt(process.env.query_limit || "10"),
} as {
    port: number;
    database: DatabaseConnectionArgs;
    jwtSecret: string;
    salt: string;
    uploadDirectory: string;
    queryLimit: number;
};