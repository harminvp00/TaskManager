import { Schema, model } from "mongoose";

const authSchema = new Schema({
    username : {
        type : String,
        require : true
    },
    email : {
        type : String,
        require : true
    },
    passwordHash : {
        type : String,
        require : true
    },
    verify: {
        type: Boolean,
        default: false
    }, 

    roles: {
        type: String,
        default: "user",
        enum: ['user', 'admin']
    },

    otp: {
        type: String,
        default: null
    },

    optExpiresAt:{
        type: Date,
        default: null    
    }
}, {
    timestamps: true,
    strict: true
});

const User = model("user", authSchema);
export default User;
