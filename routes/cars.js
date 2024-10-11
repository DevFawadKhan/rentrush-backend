import express from 'express'
 import multer from 'multer'
 import car_Model from '../Model/Car.js'
const router= express.Router()
const storage=multer.diskStorage({
   destination:function(req,file,cb){
      cb(null,'./uploads')
   },
   filename:function(req,file,cb){
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null,uniqueSuffix+"-"+file.originalname)
   }
 })
 const upload=multer({storage:storage})
router.post('/add',upload.single('imgfile'),async(req,res)=>{
   try {
      const {carbrand,rentrate,carmodel,year,enginetype}=req.body
      if(!carbrand||!rentrate||!carmodel||!year||!enginetype){
         return res.status(400).json("please enter all requirments")
      }
      console.log(carbrand,rentrate,carmodel)
      console.log(req.file)
      if(!req.file){
         return res.status(400).json('No file uploaded')
      }
        await car_Model.create({
         carbrand:carbrand,
         rentrate:rentrate,
         carmodel:carmodel,
         year:year,
         enginetype:enginetype,
         images:req.file.path
     })
     return res.status(200).json("sucess")
   } catch (error) {
      return res.status(500).json('Interval server error')
   }
});
export default router