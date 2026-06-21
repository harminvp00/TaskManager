import User from "./auth.model.js";

export const findByEmail = async (email) => {
  return await User.findOne({ email });
};

export const createUser = async (payload) => {
  return await User.create(payload);
};

export const findByIdandUpdate = async (id, updates) => {
  return await User.findByIdAndUpdate(id, updates, {
    new: true,
  });
};
