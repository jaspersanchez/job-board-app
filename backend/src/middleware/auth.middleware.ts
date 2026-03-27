import { Request, Response, NextFunction } from "express";
import UserModel, { IUser } from "../models/user.model";
import jwt from "jsonwebtoken";
import { env } from "../utils/env";

// Extend request and add user
interface AuthRequest extends Request {
  user?: IUser;
}

// define protect funct
const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // get auth header
  const authHeader = req.headers.authorization;

  // validate auth head
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }

  try {
    // extact token and decode
    const token = authHeader?.split(" ")[1]!;
    const decoded = jwt.verify(token, env.jwtSecret) as { id: string };

    // query user on db and add user on req
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Token invalid or expired" });
  }
};
