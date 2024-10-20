import express from "express";
import { createError } from "../utils/errorGenerator.util.js";
import { Node } from "../models/node.model.js";
import {addAST,deletenodes,evaluateData} from "../controllers/astControllers.controller.js"
const allRouter=express.Router()

allRouter.post("/createnode",addAST);
allRouter.delete("/deletenodes",deletenodes);
allRouter.get("/evaluatedata/:_id",evaluateData);

export default allRouter;