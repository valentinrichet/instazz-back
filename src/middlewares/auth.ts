import { verifyJWTToken } from "../libs/auth";
import { Request, Response, NextFunction } from "express";

export function verifyJWT_MW(req: any, res: Response, next: NextFunction) {
  let token: string = req.headers.authorization?.substring(7) || "";
  verifyJWTToken(token)
    .then(decodedToken => {
      req.user = decodedToken.data;
      console.log(decodedToken);
      next();
    })
    .catch(err => {
      console.error(err);
      return res.status(404).send("Your token is invalid.");
    });
}