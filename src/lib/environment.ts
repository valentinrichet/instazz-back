import { config } from "dotenv";
import { resolve } from "path";

const environment: string = (process.env.NODE_ENV || "development").trim();
config({ path: resolve(__dirname, `../../env/${environment}.env`) });

export const Environment = {
    port: parseInt(process.env.database_port || "0"),
    database: {
        ip: process.env.database_ip || "",
        port: parseInt(process.env.database_port || "0"),
        username: process.env.database_username || "",
        password: process.env.database_password || ""
    }
};