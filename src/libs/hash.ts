import bcrypt from "bcrypt";
import Environment from "./environment";

export async function hash(value: string): Promise<string> {
    try {
        const hashedValue: string = await (await bcrypt.hash(value, Environment.salt)).replace(Environment.salt, "");
        return hashedValue;
    } catch (err) {
        console.error(`Problem while hashing the value: ${value}`);
        throw err;
    }
}