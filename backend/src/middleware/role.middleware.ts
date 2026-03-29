import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth.middleware";
import { UserRole } from "../models/user.model";

export const requireRole =
  (roles: UserRole) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || roles !== req.user.role) {
      res.status(403).json({ message: "Access denied - wrong role" });
      return;
    }
    next();
  };
