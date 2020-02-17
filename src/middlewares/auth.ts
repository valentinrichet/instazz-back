import { NextFunction, Response } from "express";
import { verifyJWTToken } from "../libs/auth";

export async function verifyJWT_MW(req: any, res: Response, next: NextFunction) {
  let token: string = req.headers.authorization?.substring(7) || "";
  try {
    let decodedToken: any = await verifyJWTToken(token);
    req.user = decodedToken.data;
    next();
  } catch (exception) {
    console.error(exception);
    return res.status(404).send("Your token is invalid.");
  }
}