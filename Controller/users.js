import bcrypt from 'bcryptjs';
import {validationResult} from 'express-validator'
import userSignup from '../Model/signup.js'
import jwt from 'jsonwebtoken'
export const usersSignup = async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
        }
        const alredyUser=await userSignup.findOne({email:req.body.email})
        if (alredyUser) return res.status(400).json('User Alredy exixt')
        const salt=await bcrypt.genSalt(10);
        const password=await bcrypt.hash(req.body.password, salt);
        let user={
            name:req.body.name,
            email:req.body.email,
            cnic:req.body.cnic,
            contactNumber:req.body.contactNumber,
            address:req.body.address,
            password:password,
            role:req.body.role
            
        }
        const signup= new userSignup(user);
        signup.save()
        .then(()=>{
            return res.status(200).json('Account created succesfully')
        })
        .catch((err)=>{
            return res.status(400).json("Something went wrong")
            })

}






export const login = async (req, res) => {
    const Email = req.body.email;
    try {
      console.log(Email);
      const User_Data = await userSignup.findOne({ email: Email });
      if (!User_Data) {
        return res.status(402).json({ message: "Try login with correct details" });
      }
  
      const Compare_Password = await bcrypt.compare(req.body.password, User_Data.password);
      if (!Compare_Password) {
        return res.status(400).json({ message: "Try to login with correct credentials" });
      }
  
      // Create JWT token
      const data = {
        id: User_Data.id,
        role: User_Data.role 
      };
      console.log(data)
      const AuthToken = jwt.sign(data, process.env.SECRET_KEY);

      res.cookie('auth_token', AuthToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', 
        maxAge: 60 * 60 * 1000,
      });
      return res.status(200).json("Login Successfully");
  
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error, try again", error });
    }
  };



//   this is just for testing purpose
  export const test=(req,res)=>{
    res.status(200).json({ message: 'Access granted', userId: req.user, role:req.role || "NO ROLE" });
  }