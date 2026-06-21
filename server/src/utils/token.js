import jwt from "jsonwebtoken";

export const getToken = (id, email, role) => {
  const token = jwt.sign(
    {
      id: id,
      email: email,
      role: role,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "7d",
    },
  );
  return token;
};


