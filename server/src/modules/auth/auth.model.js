import {Schema,model} from "mongoose";

const authSchema = new Schema({
    username : {
        type : String,
        require : true
    },
    email : {
        type : String,
        unique : true,
        require : true
    },
    password : {
        type : String,
        require : true
    }
});

const User = model("user", authSchema);
export default User;
