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
    }
} as {
    port: number;
    database: DatabaseConnectionArgs
};