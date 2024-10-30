import signup from "../Model/signup.js"
import Status_Model from "../Model/showroomStatus.js";
 export const Adminview=async (req,res)=>{
  const Admin_view= await signup.find({role:{$in:['showroom','client']}})
  const showroomData = [];
  const clientData = [];
     if(!Admin_view || Admin_view.length===0){
        res.status(404).json({msg:"No data found"})
     }
     console.log(Array.isArray(Admin_view))
     Admin_view.forEach((item) => {
       if (item.role === 'showroom') {
         showroomData.push(item);
       } else if (item.role === 'client') {
         clientData.push(item);
       }
     });
     res.json({
        showroomSection: showroomData,
        clientSection: clientData,
      });
}
export const BanShowroom=async(req,res)=>{
const {showroomid}=req.body
try {
  const showroom=await signup.findById(showroomid)
  console.log(showroom)
  if(!showroom){
   return  res.json("showroom not found")
  }
   await Status_Model.create({
    showroomId:showroom._id,
    status:'baned'
  })
  return res.status(200).json({ msg: "Showroom banned successfully" });
} catch (error) {
  return res.status(500).json({ msg: "Error banning showroom", error });
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
export const Active_Show_Room=async (req,res)=>{
    const {BanId}=req.body;
    const Update_Data=await Status_Model.findByIdAndUpdate(BanId,{
      status:'active',
      new:true
    })
    if(Update_Data){
      console.log(Update_Data)
      res.json("update data")
    }
}