// auth controller
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
