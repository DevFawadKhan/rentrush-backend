
import mongoose from "mongoose";
const schema=mongoose.Schema;
const userSignup =new schema(
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
        },
        role:{
            enum:['admin','user',"showroom"],
            type:String,
            required:true
        }

    },{timestamps:true}
);
const UserSignup=mongoose.model('userSignup',userSignup);
UserSignup.createIndexes();
// module.exports=Signup;
export default UserSignup;