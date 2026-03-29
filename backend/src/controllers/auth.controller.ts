import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

const generateToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;

  // check user role
  if (!["employer", "applicant"].includes(role)) {
    res.status(400).json({ message: "Invalid role" });
    return;
  }

  const exists = await User.findOne({ email });

  if (exists) {
    res.status(400).json({ message: "Email already registered" });
    return;
  }

  const user = await User.create({ name, email, password, role });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id.toString()),
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id.toString()),
  });
};
