import { Schema, model } from "mongoose";

/**
 * Bugs found from this file,
 * name mismatch into the sevice file where here is we declare optExpireAt and used otpExpireAt, very small one later chnage this never cause a runtime issues but indirectly make no change in mongodb because we used strict true, which only allow this property only in mongo document, Same thing happen with the roles and we used role in services, so I am changed roles to role only
 */
const authSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, default: null },
    provider: { type: String, enum: ["local", "github", 'google'], default: "local" },
    providerId: { type: String, default: null },
    verify: { type: Boolean, default: false },
    role: { type: String, default: "user", enum: ["user", "admin"] },
    otp: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null },
    resetToken: { type: String, default: null },
    resetTokenExpiresAt: { type: Date, default: null },
    resetTokenUsed: { type: Boolean, default: false },
  },
  { timestamps: true, strict: true },
);

const User = model("user", authSchema);

export default User;
