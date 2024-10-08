import bcrypt from 'bcryptjs';
import {validationResult} from 'express-validator'
import Signup from '../Model/signup.js'

export const signup = async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
        }
        const salt=await bcrypt.genSalt(10);
        const password=await bcrypt.hash(req.body.password, salt);
        let user={
            name:req.body.name,
            email:req.body.email,
            cnic:req.body.cnic,
            contactNumber:req.body.contactNumber,
            address:req.body.address,
            password:password
            
        }
        const signup= new Signup(user);
        signup.save()
        .then(()=>{
            return res.status(200).json('Account created succesfully')
        })
        .catch((err)=>{
            return res.status(400).json(err)
            })

}