import jwt, { decode } from "jsonwebtoken";
import "dotenv/config";
import crypto from "crypto";

export const getAccessToken = (id, email, role, sessionId) => {
  const token = jwt.sign(
    {
      id: id,
      email: email,
      role: role,
      sessionId,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "10m",
    },
  );
  return token;
};
export const getRefreshToken = (id, email, role) => {
  const token = jwt.sign(
    {
      id: id,
      email: email,
      role: role,
      jti: crypto.randomUUID(),
    },
    process.env.JWT_REFRESH_SECRET_KEY,
    {
      expiresIn: "7d",
    },
  );
  return token;
};

export const decodeAccessToken = (token) => {
  const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

  return {
    id: decode.id,
    email: decode.email,
  };
};

export const decodeRefreshToken = (token) => {
  const decode = jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY);

  return {
    id: decode.id,
    email: decode.email,
    sessionId: decode.sessionId,
  };
};

export const hashToken = async (token) => {
  const hashedToken = await crypto.createHash("sha256").update(token).digest("hex");
  return hashedToken;
}