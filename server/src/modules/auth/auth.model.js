import {Schema,model} from "mongoose";

const authSchema = new Schema({
    username : {
        type : String,
        require : true
    },
    email : {
        type : String,
        require : true
    },
    password : {
        type : String,
        require : true
    }
});

export default User = model("user", authSchema);
