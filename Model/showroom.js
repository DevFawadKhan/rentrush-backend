
import mongoose from "mongoose";
const schema=mongoose.Schema;
const showRoomSchema =new schema(
    {
        showRoomName:{
            type:String,
            required:true
        },
        ownerName:{
            type:String,
            required:true
        },
        showRoomEmail:{
            type:String,
            required:true,
            unique:true
        },
        ownerCnic:{
            type:Number,
            required:true
        },
        contactNumber:{
            type:Number,
            required:true,

        },
        showroomAddress:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        role:{
            type:String,
            required:true,
            default:'user'
        }

    },{timestamps:true}
);
const ShowRoomSchema=mongoose.model('ShowRoom',showRoomSchema);
ShowRoomSchema.createIndexes();
export default ShowRoomSchema;