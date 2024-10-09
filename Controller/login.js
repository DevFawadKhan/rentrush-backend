import Signup from "../Model/signup.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
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
    // Create jwt token.
    console.log(User_Data.id)
    const data={
        user:{
            id:User_Data.id
        }
    }
     const Authtoken=jwt.sign(data,process.env.SECRET_KEY)
     console.log('Check in console',Authtoken)
    return res.status(200).json("Login Sucessfully")
  } catch (error) {
    console.log(error)
    return res.status(500).json("Internal server error try again",{error}) 
  }
    }