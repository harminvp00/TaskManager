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
export const findByIdandUpdate = async (id, updates) => {
  return await User.findByIdAndUpdate(id, updates)
};


export const findUserByToken = async (tokenHash) =>{
  /**
   * this function return a user which satify this three conditions 
   * 1. tokenHash match true
   * 2. token not expire
   * 3. token used is false
   */ 
  await User.findOne({
    resetToken: tokenHash,
    resetTokenExpiresAt: { $gt: Date.now() },
    resetPasswordUsed: false
  })

  return{
    success: true,
    message: "password is reset!"
  }
}