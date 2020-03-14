import fs from "fs";
import multer from "multer";
import path from "path";
import Environment from "./environment";
import { UserData } from "../types/user_data";

export function getDiskStorage(filename?: string): multer.StorageEngine {
    return multer.diskStorage({
        destination: function (req, file, callback) {
            const userData: UserData = ((req as any).user as UserData);
            fs.mkdir(`./${Environment.uploadDirectory}/${userData.id}`, { recursive: true }, function (err) {
                if (err) {
                    console.log("error");
                    console.error(err.stack);
                } else {
                    callback(null, `./${Environment.uploadDirectory}/${userData.id}`);
                }
            });
        },
        filename: function (req, file, callback) {
            callback(null, filename != null ? `${filename}${path.extname(file.originalname)}` : `${Date.now()}${path.extname(file.originalname)}`);
        }
    });
}

export function imageFilter(req: any, file: any, cb: any) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = "Only image files are allowed!";
        return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
}