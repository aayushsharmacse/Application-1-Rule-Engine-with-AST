import {Node} from "../models/node.model.js";

const addAST=async(req,res)=>{
    const {nodeType,parentRuleCondition,parentRuleOperation,left,right,valueLeft,valueRight}=req.body;
    try{
    let existingNode;
    if (nodeType === "INTERNAL") {
        existingNode = await Node.findOne({ nodeType, parentRuleOperation, left, right });
    } else if (nodeType === "LEAF") {
        existingNode = await Node.findOne({ nodeType, parentRuleCondition, valueLeft, valueRight});
    }
    if (existingNode) {
        const {_id}=existingNode;
        return res.status(200).json({ success: true, result: { message: "Node already exists." ,_id} });
    }
    let newNode;
    if(nodeType==="INTERNAL"){
        newNode=await Node.create({
            nodeType,parentRuleOperation,left,right
        })
    }
    else if(nodeType==="LEAF"){
        newNode=await Node.create({
            nodeType,parentRuleCondition,valueLeft,valueRight
        })
    }
    const {_id}=newNode;
    return res.status(200).json({success:true,result:{message: "New node created",_id}});
    }catch(e){
        return res.status(400).json({success:false,result:{message:e.message}})
    }
}

const deletenodes=async(req,res)=>{
    try {
        await Node.deleteMany({});
        res.status(200).json({success:true,result:{message: "Successfully deleted"}});
    } catch (error) {
        res.status(500).json({ success: false, result:{message:e.message} });
    }
}
export {addAST,deletenodes};