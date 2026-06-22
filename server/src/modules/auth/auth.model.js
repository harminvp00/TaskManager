

import { Schema, model } from "mongoose";

const authSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    verify: { type: Boolean, default: false },
    roles: { type: String, default: "user", enum: ["user", "admin"] },
    otp: { type: String, default: null },
    optExpiresAt: { type: Date, default: null },
    resetToken: { type: String, default: null },
    resetTokenExpiresAt: { type: Date, default: null },
    resetPasswordUsed: { type: Boolean, default: false },
  },
  { timestamps: true, strict: true },
);

const User = model("user", authSchema);

export default User;
