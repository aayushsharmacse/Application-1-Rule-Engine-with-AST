import mongoose from "mongoose";

const nodeSchema=new mongoose.Schema({
    nodeType:{
        type:String,
        enum:["INTERNAL","LEAF"],
        required:true
    },
    parentRuleCondition:{
        type:String,
        enum:['>','<','=']
    },
    parentRuleOperation:{
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