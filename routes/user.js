import express from "express";
import {body, validationResult} from 'express-validator'
import {signup} from "../Controller/signup.js";
const router=express.Router()

router.get("/user",(req,res)=>{
    res.send("test api")
})

router.post('/signup', [body('name').isLength({min:3}), body("email").isEmail(),body('cnic').isLength({min:13, max:13}), body('contactNumber').isLength({min:11, max:11}), ], signup);


export default router;