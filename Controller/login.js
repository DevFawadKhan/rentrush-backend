import Signup from "../Model/signup.js";
import bcrypt from 'bcryptjs'
export const login=async(req,res)=>{
    const Email=req.body.email;
  try {
    const User_Data=await Signup.findOne({email:Email})
    if(!User_Data){
        return res.status(402).json("Try login with correct details")
    }
    const Compaire_Password= await bcrypt.compare(req.body.password,User_Data.password);
    if(!Compaire_Password){
        return res.status(400).json("Try to login with correct credintials")
    }
    return res.status(200).json("Login Sucessfully")
  } catch (error) {
    console.log(error)
    return res.status(500).json("Internal server error try again",{error}) 
  }
    }