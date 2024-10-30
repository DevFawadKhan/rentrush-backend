import mongoose from "mongoose";

const Status= new mongoose.Schema({
    showroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users_data', required: true },
    status:{type :String ,enum:['active','baned'],default:'active'}
})

const Status_Model=mongoose.model('Showroomstatus',Status)

export default Status_Model