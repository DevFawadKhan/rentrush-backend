import signup from "../Model/signup.js"
import Status_Model from "../Model/showroomStatus.js";
import mongoose from "mongoose";
 export const Adminview=async (req,res)=>{
  const Admin_view = await signup.aggregate([
    {
      $match: { role: { $in: ["showroom", "client"] } },
    },
    {
      $lookup: {
        from: "showroomstatuses", // name of the collection for the status model in lowercase
        localField: "_id",
        foreignField: "showroomId",
        as: "status",
      },
    },
    {
      $unwind: {
        path: "$status",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        showroomName: 1,
        ownerName: 1,
        cnic: 1,
        contactNumber: 1,
        address: 1,
        email: 1,
        password: 1,
        role: 1,
        status: {
          $cond: {
            if: { $eq: ["$role", "showroom"] },
            then: { $ifNull: ["$status.status", "active"] },
            else: "$$REMOVE",
          },
        },
      },
    },
  ]);

  if (!Admin_view || Admin_view.length === 0) {
    return res.status(404).json({ msg: "No data found" });
  }
  const showroomData = [];
  const clientData = [];
      console.log(Array.isArray(Admin_view))  //just check for selfpurpose
     Admin_view.forEach((item) => {
       if (item.role === 'showroom') {
         showroomData.push(item);
       } else if (item.role === 'client') {
         clientData.push(item);
       }
     });
     console.log(showroomData)
     res.json({
        showroomSection: showroomData,
        clientSection: clientData,
      });
}
export const BanShowroom=async(req,res)=>{
const {showroomid}=req.params
console.log(showroomid)
try {

  const showroom=await signup.findById(showroomid)
  console.log(showroom)
    const exist_ban=await Status_Model.findOne({showroomId:showroom._id ,status:'baned'})
  //  console.log(exist_ban)
   if (exist_ban){
     return res.status(400).json("This showroom is already banned");
   }
   await Status_Model.create({
    showroomId:showroom._id,
    status:'baned'
  })
  return res.status(200).json({ msg: "Showroom banned successfully" });
} catch (error) {
  return res.status(500).json({ msg: "Error banning showroom",error:error.message});
}
}
export const Show_BanShow_Room= async(req,res)=>{
     try {
    const Ban_Data=await Status_Model.find().populate('showroomId')
     console.log(Ban_Data)
      if(!Ban_Data||Ban_Data.length===0){
        return res.status(404).json({message:"No Ban Showroom"})
      }
      return res.status(201).json({BanUser:Ban_Data})
     } catch (error) {
      return res.status(500).json("Internal server error")
     }
}
export const Active_Show_Room=async(req,res)=>{
    const {BanId}=req.body;
    const Update_Data=await Status_Model.findByIdAndDelete(BanId)
    if(Update_Data){
      console.log(Update_Data)
      res.json("update data")
    }
}