

import * as services from "./auth.service.js";

export const registerUser = async (req, res) => {
  try {
    const result = await services.register(
      req.body.username,
      req.body.email,
      req.body.password,
    );

    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const result = await services.verify(req.body.email, req.body.otp);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const response = await services.login(email, password);

    res.json(response);
  } catch (error) {
    // change this later
    console.error(error.message);
  }
};


// new 

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await services.forgetPassword(email);
    res.json(response);
  } catch (error) {
    res.json({ error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const {newPassword} = req.body;
    const token  = req.query.token;

    const response = await services.resetPassword(token, newPassword);

    res.json({
      response
    })

  } catch (error) {
    // change me later
    res.json({ error: error.message });
  }
};


export const changePassword = async (req, res) => {
  try {
    const { oldPass, newPass } = req.body;
    const response = await services.changePassword(oldPass, newPass);
    res.send(response);

  }catch (error){
    // update me later 
    console.error(error.message);
  }
}


export const logout = async (req, res) => {

  try {
    // logout functionality will come soon!
  }catch(error){
    // change later 
    console.log(error.message)
  }
}