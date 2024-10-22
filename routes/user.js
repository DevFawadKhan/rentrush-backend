import express from "express";
import {body} from 'express-validator'
import {Signup,login, test, forgotPassword, resetPassword} from "../Controller/users.js";
import { verifyToken } from '../Middleware/verifyToken.js';
// import {login} from "../Controller/login.js";
const router=express.Router()

router.get("/user",(req,res)=>{
    res.send("test api")
})
router.post('/signup', [body('ownerName').isLength({min:3}), body("email").isEmail(),body('cnic').isLength({min:15, max:15}), body('contactNumber').isLength({min:12, max:12}), ], Signup);
// router.post('/showroom', [body('showRoomName').isLength({min:3}),body('ownerName').isLength({min:3}), body("showRoomEmail").isEmail(),body('ownerCnic').isLength({min:13, max:13}), body('contactNumber').isLength({min:11, max:11})], showRoom);
router.post('/login',[body('email').isEmail()] , login)
router.post('/forgot-password', forgotPassword);

//   this is just for testing purpose
router.get('/test',verifyToken, test)

export default router;