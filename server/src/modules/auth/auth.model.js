import { Schema, model } from "mongoose";

const authSchema = new Schema({
    username : {
        type : String,
        require : true
    },
    email : {
        type : String,
        require : true,
        unique: true
    },
    passwordHash : {
        type : String,
        require : true
    },
    verify: {
        type: Boolean,
        default: false
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

export default User = model("user", authSchema);
