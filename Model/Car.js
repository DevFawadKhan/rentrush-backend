import mongoose from "mongoose";
const car_Schema= new  mongoose.Schema({
   carbrand:{type:String,required:true},
   rentrate:{type:Number,required:true},
   carmodel:{type:String,required:true},
   year:{type:Number,required:true},
   images:{type:String},
   enginetype:{type:String,required:true}
})
const car_Model=mongoose.model('cars',car_Schema);
export default car_Model