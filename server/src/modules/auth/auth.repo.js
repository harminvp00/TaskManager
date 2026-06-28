import User from "./auth.model.js";

// find user based on id
export const findByEmail = async (email) => {
  return await User.findOne({ email });
};

// To Create User Only
export const createUser = async (payload) => {
  return await User.create(payload);
};

/**
 * Change Password
 * Add reset token
 * Add otp code
 * Forget/Change Password
 */
export const updateUserById = async (id, updates) => {
  return await User.updateUserById(id, updates);
};

/**
 * Bug: this query method always return true, our service expect a user to get user._id, but repo always return true, do not return true just return user object, then service will automatically know what to do
 */
export const findUserByToken = async (tokenHash) => {
  /**
   * this function return a user which satify this three conditions
   * 1. tokenHash match true
   * 2. token not expire
   * 3. token used is false
   */

  // bug
  // await User.findOne({
  //   resetToken: tokenHash,
  //   resetTokenExpiresAt: { $gt: Date.now() },
  //   resetTokenUsed: false,
  // });

  // return {
  //   success: true,
  //   message: "password is reset!",
  // };

  return await User.findOne({
    resetToken: tokenHash,
    resetTokenExpiresAt: { $gt: Date.now() },
    resetTokenUsed: false,
  });
};


export const findOAuthUser = async (provider, providerId) => {
  return await User.findOne({
    provider,
    providerId,
  });
};
