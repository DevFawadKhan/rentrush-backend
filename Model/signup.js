
import mongoose from "mongoose";
const schema=mongoose.Schema;
const signup =new schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        cnic:{
            type:Number,
            required:true
        },
        contactNumber:{
            type:Number,
            required:true,

        },
        address:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        }

    },{timestamps:true}
);
const Signup=mongoose.model('Signup',signup);
Signup.createIndexes();
// module.exports=Signup;
export default Signup;