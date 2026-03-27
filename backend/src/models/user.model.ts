import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "employer" | "applicant";

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  matchPassword: (entered: string) => Promise<boolean>;
}

// TODO: CONTINUE ON THE USER SCHEMA
const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["employer", "applicant"], required: true },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  // hash user password
  this.password = await bcrypt.hash(this.password, 10);
});

// match user password with entered password
userSchema.methods.matchPassword(async function (this: IUser, entered: string) {
  return bcrypt.compare(entered, this.password);
});

const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;
