import { Schema,models,model } from "mongoose";

const HostelSchema= new Schema({
    name:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        requied:true
    },
    provider:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

},{
    timestamps:true
});

export default models.Hostel || model("Hostel",HostelSchema);