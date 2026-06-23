
import jwt, { decode } from "jsonwebtoken";
import "dotenv/config";

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



export const decodeToken =  (token) =>{

  const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

  return {
    id: decode.id,
    email: decode.email
  }
}
