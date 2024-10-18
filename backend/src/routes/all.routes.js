import express from "express";
import { createError } from "../utils/errorGenerator.util.js";
import { Node } from "../models/node.model.js";

const allRouter=express.Router()

allRouter.get("/createnode",async (req,res)=>{
    const data=req.body;
    console.log(data);
    return res.status(200).json({success:true,result:"xyz"});
});

// userRouter.register
export default allRouter;