import express from 'express'
 import multer from 'multer'
 import { removeCar,addCar,searchCar } from '../Controller/carsController.js'
 import { verifyToken } from '../Middleware/verifyToken.js';
 const storage=multer.diskStorage({
    destination: function(req,file,cb){ return cb(null,'./uploads');},
    filename: function(req,file,cb){return cb(null,`${Date.now()}-${file.filename}`)}
 })
 const upload=multer({storage})
const router= express.Router()
router.post('/add',upload.single('imgfile'), verifyToken,addCar)

router.delete("/delete/:id", verifyToken, removeCar)
router.get('/api/cars/search', searchCar);

export default router