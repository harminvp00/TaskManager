import "dotenv/config";
import { createUser, findOAuthUser } from "../auth/auth.repo.js";

const saveUserinDB = async (user) => {
  const newUser = await createUser({
    username: user.given_name,
    email: user.email,
    provider: "google",
    providerId: user.id,
    verify: true,
  });

  return {
    message: "create a new user",
    user: {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      provider: newUser.provider,
      role: newUser.role,
      verify: newUser.verify,
    },
  };
};

export const exchangeForToken = async (code) => {
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: "http://localhost:3000/googleAuth/callback",
      grant_type: "authorization_code",
    }),
  });

  const tokens = await tokenResponse.json();
  return tokens;
};

export const getUserFromGoogle = async (access_token) => {
  const userResponse = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  );

  const gogoleUser = await userResponse.json();
  const userExist = await findOAuthUser("google", `${gogoleUser.id}`);

  if (!userExist) {
    const result = await saveUserinDB(gogoleUser);
    return result;
  }

  return {
    message: "existing user login",
    user: {
      id: userExist._id,
      username: userExist.username,
      email: userExist.email,
      provider: userExist.provider,
      role: userExist.role,
      verify: userExist.verify,
    },
  };
};
