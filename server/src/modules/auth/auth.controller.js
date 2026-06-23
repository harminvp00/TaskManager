

import createHttpError from "http-errors";
import * as services from "./auth.service.js";

export const registerUser = async (req, res, next) => {
  try {
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

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const response = await services.login(email, password);

    res.json(response);
  } catch (error) {
    return next(createHttpError(400,error.message));
  }
};


// new 

export const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const response = await services.forgetPassword(email);
    res.json(response);
  } catch (error) {
    return next(createHttpError(400, error.message));
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const {newPassword} = req.body;
    const token  = req.query.token;

    const response = await services.resetPassword(token, newPassword);

    res.json({
      response
    })

  } catch (error) {
   return next(createHttpError(400,error.message));
  }
};


export const changePassword = async (req, res, next) => {
  try {
    const { oldPass, newPass } = req.body;
    const response = await services.changePassword(oldPass, newPass);
    res.send(response);

  }catch (error){
    return next(createHttpError(400,error.message));
  }
}


export const logout = async (req, res, next) => {

  try {
    // logout functionality will come soon!
  }catch(error){
    return next(createHttpError(400,error.message));
  }
}