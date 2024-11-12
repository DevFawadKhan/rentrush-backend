import express from 'express'
 import multer from 'multer'
 import {
   removeCar,
   addCar,
   searchCar,
   updateCar,
   getAllCars,
   updateReturnDetails,
   completeMaintenance,
 } from "../Controller/carsController.js";
 import { verifyToken } from "../Middleware/verifyToken.js";

 import fs from "fs";
 import path from "path";
 import { fileURLToPath } from "url";

 const __filename = fileURLToPath(import.meta.url);
 const __dirname = path.dirname(__filename);

 // const uploadPath = path.join(__dirname, "../../RentRush/public/uploads");
 //  const path = "../../RentRush/public/uploads";

 //  if (!fs.existsSync(path)) {
 //    console.log("Directory does not exist. Creating directory...");
 //    fs.mkdirSync(path, { recursive: true });
 //  } else {
 //    console.log("Directory exists.");
 //  }

 const uploadPath = path.join(__dirname, "../../RentRush/public/uploads");

 if (!fs.existsSync(uploadPath)) {
   console.log("Directory does not exist. Creating directory...");
   fs.mkdirSync(uploadPath, { recursive: true });
 } else {
   console.log("Directory exists.");
 }

 const storage = multer.diskStorage({
   destination: function (req, file, cb) {
     return cb(null, uploadPath);
   },
   filename: function (req, file, cb) {
     const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
     req.body.images = filename; // Set filename directly to req.body.images
     cb(null, filename);
     // return cb(null, `${Date.now()}-${file.originalname}`);
   },
 });
 const upload = multer({ storage });
 //  console.log(path);
 const router = express.Router();
 router.post("/add", upload.array("images", 3), verifyToken, addCar);
 router.put("/update/:Id", upload.array("images", 3), verifyToken, updateCar);
 router.get("/get-all-cars", verifyToken, getAllCars);
 router.delete("/delete/:id", verifyToken, removeCar);
 router.get("/search", searchCar);
 router.post("/return", verifyToken, updateReturnDetails);
 // Route for marking maintenance as complete
 router.post("/complete-maintenance", verifyToken, completeMaintenance);

export default router