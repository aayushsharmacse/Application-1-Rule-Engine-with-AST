import mongoose from "mongoose";

const nodeSchema=new mongoose.Schema({
    nodeType:{
        type:String,
        enum:["INTERNAL","LEAF"]
    },
    ParentRuleCondition:{
        type:String,
        enum:['>','<','=']
    },
    ParentRuleOperation:{
        type: String,
        enum: ["OR", "AND"]
    },
    left:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Node"
    },
    right:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Node"
    },
    valueLeft:{
        type:String
    },
    valueRight:{
        type:String
    }

}, {timestamps:true})

export const Node=mongoose.model("Node",nodeSchema);