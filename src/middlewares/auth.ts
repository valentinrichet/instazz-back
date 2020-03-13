import { NextFunction, Response } from "express";
import { verifyJWTToken } from "../libs/auth";
import { UserData } from "../types/user_data";

export async function verifyJWT_MW(req: any, res: Response, next: NextFunction) {
  try {
    await addAndVerifyToken(req, res);
    next();
  } catch (exception) {
    console.error(exception);
    return res.status(404).send("Your token is invalid.");
  }
}

export async function isAdmin_MW(req: any, res: Response, next: NextFunction) {
  if (req.user == null) {
    try {
      await addAndVerifyToken(req, res);
    } catch (exception) {
      console.error(exception);
      return res.status(404).send("Your token is invalid.");
    }
  }
  const userData: UserData = ((req as any).user as UserData);
  if (userData.role !== "admin") {
    return res.status(401).send("You are not allowed to do this action.");
  }
  next();
}

export async function isAdminOrUser_MW(req: any, res: Response, next: NextFunction) {
  if (req.user == null) {
    try {
      await addAndVerifyToken(req, res);
    } catch (exception) {
      console.error(exception);
      return res.status(404).send("Your token is invalid.");
    }
  }
  const userId: string = req.params.id;
  const userData: UserData = ((req as any).user as UserData);
  if (userData.role !== "admin" && userData.id !== userId) {
    return res.status(401).send("You are not allowed to do this action.");
  }
  next();
}

async function addAndVerifyToken(req: any, res: Response) {
  const token: string = req.headers.authorization?.substring(7) || "";
  const decodedToken: any = await verifyJWTToken(token);
  req.user = decodedToken.data;
}