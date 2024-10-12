import express from 'express'
 import multer from 'multer'
 const storage=multer.diskStorage({
    destination: function(req,file,cb){ return cb(null,'./uploads');},
    filename: function(req,file,cb){return cb(null,`${Date.now()}-${file.filename}`)}
 })
 const upload=multer({storage})
const router= express.Router()
import addCar from '../Controller/carsController.js'
router.post('/add',upload.single('imgfile'),addCar)
export default router