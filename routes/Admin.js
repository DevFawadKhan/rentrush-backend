import express from "express"
const router=express.Router()
import loginAdmin from "../Controller/Adminlogin.js";

router.post('/login',loginAdmin)

export default router;