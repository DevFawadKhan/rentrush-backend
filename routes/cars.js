import express from 'express'
 import multer from 'multer'
 import { removeCar,addCar,searchCar,updateCar,getAllCars } from '../Controller/carsController.js'
 import { verifyToken } from '../Middleware/verifyToken.js';
 const path="../../RentRush/public/uploads";
 const storage=multer.diskStorage({
    destination: function(req,file,cb){ return cb(null,path);},
    filename: function(req,file,cb){return cb(null,`${Date.now()}-${file.originalname}`)}
 })
 const upload=multer({storage})
 console.log(path)
const router= express.Router()
router.post('/add',upload.single('images'), verifyToken,addCar)
router.put('/update:carId', verifyToken,updateCar)
router.get('/get-all-cars', verifyToken,getAllCars)

router.delete("/delete/:id", verifyToken, removeCar)
router.get('/search', searchCar);

export default router