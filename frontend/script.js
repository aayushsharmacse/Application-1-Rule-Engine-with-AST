
console.log("inside js")
function areParenthesesBalanced(expression) {
    let balance = 0;

    for (const char of expression) {
        if (char === '(') {
            balance++;
        } else if (char === ')') {
            balance--;
        }
        if (balance < 0) {
            return false;
        }
    }
    return balance === 0;
}
const createASTLeaf=async(modifiedInput)=>{
    const n=modifiedInput.length;
    let nodeType="LEAF";
    let valueLeft;
    let valueRight;
    let parentRuleCondition;
    for(let i=0;i<n;i++){
        if(modifiedInput[i]==='<' || modifiedInput[i]==='>' || modifiedInput[i]==='='){
            parentRuleCondition=modifiedInput[i];
            valueLeft=modifiedInput.slice(0,i).trim();
            valueRight=modifiedInput.slice(i+1).trim();
            console.log(nodeType,parentRuleCondition,valueLeft,valueRight);
            console.log("going to request")
            try{
            const {data : ASTNode}=await axios.post(
                "https://rule-engine-with-ast-iobg.onrender.com/api/v1/createnode",
                {
                    nodeType,parentRuleCondition,valueLeft,valueRight
                }
            )
            console.log(ASTNode);
            if(ASTNode.success===true){
            console.log(ASTNode.result._id);
            return ASTNode.result._id;
            }
            else{
                console.log(`${modifiedInput} has seen an err- `,ASTNode.result.message)
            }
            }
            catch(e){
                alert(e);
                return;
            }
        }
    }
    alert("Wrong input received");
    throw new Error("Wrong input received");
    return;
}
const createAST=async (modifiedInput)=>{
    modifiedInput=modifiedInput.trim();
    if(modifiedInput[0]==='(' && modifiedInput[modifiedInput.length-1]===')'){
        const isBalanced=areParenthesesBalanced(modifiedInput.slice(1, -1))
        if(isBalanced){
            modifiedInput=modifiedInput.slice(1, -1);
            return createAST(modifiedInput);
        }
    }
    const n=modifiedInput.length;
    let bracketCnt=0;
    for(let i=0;i<n;i++){
        if(bracketCnt===0 &&
             (
                ( (i<(n-1)) && modifiedInput[i]+modifiedInput[i+1]==="OR")
                || ( (i<(n-2)) && modifiedInput[i]+modifiedInput[i+1]+modifiedInput[i+2]==="AND")
            ) 
            ){
            let left;
            let right;
            let parentRuleOperation;
            let nodeType="INTERNAL";
            if( (i<(n-2)) && modifiedInput[i]+modifiedInput[i+1]+modifiedInput[i+2]==="AND"){
                console.log("AND")
                console.log("left-",modifiedInput.slice(0,i),"end")
                console.log("right-",modifiedInput.slice(i+3),"end")
                parentRuleOperation="AND";
                left=await createAST(modifiedInput.slice(0,i));
                right=await createAST(modifiedInput.slice(i+3))
            }
            else if( (i<(n-1)) && modifiedInput[i]+modifiedInput[i+1]==="OR"){
                console.log("OR")
                console.log("left-",modifiedInput.slice(0,i),"end")
                console.log("right-",modifiedInput.slice(i+2),"end")
                parentRuleOperation="OR";
                left=await createAST(modifiedInput.slice(0,i));
                right=await createAST(modifiedInput.slice(i+2));
            }
            try{
            const {data:ASTNode}=await axios.post(
                "https://rule-engine-with-ast-iobg.onrender.com/api/v1/createnode",
                {
                    nodeType,parentRuleOperation,left,right
                }
            )
            if(ASTNode.success===true){
                console.log(ASTNode.result._id);
                return ASTNode.result._id;
            }
            else{
                console.log(`${modifiedInput} has seen an err- `,ASTNode.result.message)
            }
            }
            catch(e){
                alert(e);
                return;
            }
            return null;
        }
        if(modifiedInput[i]=='('){
            bracketCnt++;
        }
        else if(modifiedInput[i]==')'){
            bracketCnt--;
        }
    }
    return createASTLeaf(modifiedInput);
}


const create_rule=async(rule_string)=>{
    rule_string=rule_string.trim();
    if(areParenthesesBalanced(rule_string).isBalanced){
        alert("Invalid input");
        return;
    }
    // const rule_string="("+rule_string+")"
    const ASTNode=createAST(rule_string)
    return ASTNode;
}
const createRuleElement=document.getElementsByClassName("create")[0];
const combineRulesElement=document.getElementsByClassName("combine")[0];
const evaluateRuleElement=document.getElementsByClassName("evaluate")[0];
const clearDbElement=document.getElementsByClassName("clearDb")[0];
createRuleElement.addEventListener("click",
    async(e)=>{
        console.log("create rule event fired");
        const input=prompt("Please enter the rule you wish to create");                
        if(input){
            const ASTNode= await create_rule(input);
            alert(`Your AST reference node is ${ASTNode}`)        
        }
        return;
    }
)
combineRulesElement.addEventListener("click",
    async(e)=>{
        console.log("combine rules event fired")
        const input=prompt("Please enter the list of rule strings you wish to create eg. [rule1,rule2,...]");
        
        if(input){
        if(input[0]!=='[' || input[input.length-1]!==']'){
            alert("Wrong input format")
            return;
        }
        modifiedInput=input.slice(1, -1);
        const lst=modifiedInput.split(",");
        const n=lst.length;
        const combinedRules = lst.reduce((accumulator, currentRule) => {
            if(currentRule[0]==='"'){
                currentRule=currentRule.slice(1, -1);
            }
            if (accumulator) {
                return `${accumulator} AND ${currentRule}`;
            }
            return currentRule;
        }, '');
        const ASTNode=await create_rule(combinedRules);
        alert(`Your AST reference node is ${ASTNode}`);
    }
        return;
}
)

const evaluateData=async(modifiedInput)=>{
    const {_id,data}=modifiedInput;
    try{
        console.log("entered")
    const {data:response}=await axios.get(`https://rule-engine-with-ast-iobg.onrender.com/api/v1/evaluatedata/${_id}`);
    if(response.success===true){
        console.log(response.result.node);
        if(response.result.node.nodeType==="INTERNAL"){
            const { parentRuleOperation, left, right }=response.result.node;
            console.log()
            if(parentRuleOperation==="AND"){
                return ( (await evaluateData({_id:left,data}))
                 &&  (await evaluateData({_id:right,data})) );
            }
            else{
                return ( (await evaluateData({_id:left,data})) 
                || (await evaluateData({_id:right,data})) );
            }
        }
        else{
            const { parentRuleCondition, valueLeft, valueRight}=response.result.node;
            console.log("checking for ",valueLeft, parentRuleCondition, valueRight);
            if(parentRuleCondition==='<'){
            return (data[valueLeft]<Number(valueRight));
            }
            else if(parentRuleCondition==='>'){
                return (data[valueLeft]>Number(valueRight));
            }
            else if(parentRuleCondition==='='){
                if(valueLeft==="department"){
                    return (data[valueLeft]===valueRight.slice(1,-1));
                }
                else{
                    return (data[valueLeft]===Number(valueRight));
                }
            }
            return true;
        }
        return;
    }
    else{
        console.log(response.result.message)
        alert(`Has seen an err-${response.result.message}`);
        return;
    }
    return;
    }
    catch(e){
        alert(e);
        return;
    }
}
// The result is
evaluateRuleElement.addEventListener("click",
    async(e)=>{
        console.log("evaluate rule event fired")
        const input = prompt('Enter JSON rule AST and data e.g. {"_id":"60d21b4667d0d8992e610c85", "data":{"age":35,"department":"Sales","salary":60000,"experience":3}}');
        let modifiedinput,result;
        if(input){
            try{
            modifiedinput=JSON.parse(input);
            if(modifiedinput._id.length!=24){
                alert("ref must given 24-character hexadecimal strings");
                return;
            }
            }catch(e){
                alert("Wrong input provided");
                return;
            }
            try{
            result=await evaluateData(modifiedinput);
            // if(result!=""){
                alert(`The result is:${result}`)
            // }
            }catch(e){
                alert("Err evaluating data with the given ref");
                return;
            }
            return result;
        }
    }
)

clearDbElement.addEventListener("click",async()=>{
    try {
        const response = await axios.delete('https://rule-engine-with-ast-iobg.onrender.com/api/v1/deletenodes');
        // alert(response.data.success); // Success message
        if(response.data.success){
            alert("Successfully cleared the db")
        }
    } catch (error) {
        console.error('Error deleting nodes:', error.message);
    }
})

// ((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)
