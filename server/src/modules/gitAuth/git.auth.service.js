import "dotenv/config";
import axios from "axios";
import {  createUser, findOAuthUser } from "../auth/auth.repo.js";

const registerUser= async (user) => {

    const newUser = await createUser({
        username: user.name || user.login,
        email: user.email,
        provider: 'github',
        providerId: user.id,
        verify: true
    }); 

    return {
        message: 'create a new user',
        user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            provider: newUser.provider,
            role: newUser.role,
            verify: newUser.verify
        }
    };
}


export const getAccessTokenFromGitHub = async (code) => {
  const payload = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code,
  };

  const response = await axios.post(
    process.env.GITHUB_ACCESS_TOKEN_URL,
    payload,
    {
      headers: { Accept: "application/json" },
    },
  );

  const accessToken = response.data.access_token;
  return accessToken;
};

export const getUserFromGitHub = async (token) => {
  const user = await axios.get("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  const githubUser = user.data;

  const userExist = await findOAuthUser("github", `${githubUser.id}`);

  if (!userExist) {
    const result = await registerUser(githubUser);
    return result;
  }

   return {
        message: 'existing user login',
        user: {
            id: userExist._id,
            username: userExist.username,
            email: userExist.email,
            provider: userExist.provider,
            role: userExist.role,
            verify: userExist.verify,
        }
    };
};

