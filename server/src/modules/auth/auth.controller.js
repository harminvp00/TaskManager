
import createHttpError from "http-errors";
import * as services from "./auth.service.js";

export const registerUser = async (req, res, next) => {
  try {
    if (!req.body.username || !req.body.email || !req.body.password) {
      return next(createHttpError(400,"invalid fields"));
    }

    const result = await services.register(
      req.body.username,
      req.body.email,
      req.body.password,
    );

    return res.status(201).json(result);
  } catch (error) {
    return next(createHttpError(400,error.message));
  }
};

export const verifyUser = async (req, res, next) => {
  try {
    const result = await services.verify(req.body.email, req.body.otp);

    return res.status(200).json(result);
  } catch (error) {
    return next(createHttpError(400,error.message));
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "email is not valid",
      });
    }

    const result = await services.verifyEamil(email);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "invalid fields",
      });
    }

    const response = await services.login(email, password);

    res.json(response);
  } catch (error) {
    // change this later
    console.error(error.message);
  }
};

// new

export const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "provide a valid email",
      });
    }
    const response = await services.forget(email);
    res.json(response);
  } catch (error) {
    res.json({ error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const token = req.query.token;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid password",
      });
    }

    if (newPassword.length < 5) {
      return res.status(400).json({
        success: false,
        message: "password is too weak",
      });
    }

    if (!token) {
      return res.status(500).json({ message: "token is invalid" });
    }

    const response = await services.reset(token, newPassword);

    res.json({
      response,
    });
  } catch (error) {
   return next(createHttpError(400,error.message));
  }
};


export const changePassword = async (req, res) => {
  try {
    const email = req.user.email;
    const { oldPass, newPass } = req.body;

    if (!oldPass || !newPass) {
      return res.status(400).json({ message: "passwords are not accepted" });
    }

    const response = await services.change(email, oldPass, newPass);
    res.send(response);

  }catch (error){
    // update me later 
    console.error(error.message);
  }
};

export const logoutUser = async (req, res) => {

  try {
    // logout functionality will come soon!
  }catch(error){
    // change later 
    console.log(error.message)
  }
};
