console.log("inside js")

const createAST=async (modifiedInput)=>{
    modifiedInput=modifiedInput.trim();
    if(modifiedInput[0]!=='('){
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
                    "https://bug-free-memory-pxp7qrvvg9xh7wrr-3000.app.github.dev/api/v1/createnode",
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
    }
    modifiedInput=modifiedInput.slice(1, -1);
    const n=modifiedInput.length;
    let bracketCnt=0;
    for(let i=0;i<n;i++){
        if(bracketCnt===0 && modifiedInput[i]!=='(' && modifiedInput[i]!==' ' && (modifiedInput[i]==='A' || modifiedInput[i]==='O') ){
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
            else{
                console.log("Wrong rule input");
                return;
            }
            try{
            const {data:ASTNode}=await axios.post(
                "https://bug-free-memory-pxp7qrvvg9xh7wrr-3000.app.github.dev/api/v1/createnode",
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
}

const create_rule=async(rule_string)=>{
    rule_string=rule_string.trim();
    const modifiedInput="("+rule_string+")"
    const ASTNode=createAST(modifiedInput)
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
        console.log(lst);
        alert("k")
        const combinedRules = lst.reduce((accumulator, currentRule) => {
            if(currentRule[0]==='"'){
                currentRule=currentRule.slice(1, -1);
            }
            if (accumulator) {
                return `${accumulator} AND ${currentRule}`;
            }
            return currentRule;
        }, '');
        console.log(combinedRules);
        alert("h");
        const ASTNode=await create_rule(combinedRules);
        alert(`Your AST reference node is ${ASTNode}`);
    }
        return;
}
)
evaluateRuleElement.addEventListener("click",
    (e)=>{console.log("evaluate rule event fired")}
)

clearDbElement.addEventListener("click",async()=>{
    try {
        const response = await axios.delete('https://bug-free-memory-pxp7qrvvg9xh7wrr-3000.app.github.dev/api/v1/deletenodes');
        alert(response.data.success && "Successfully cleared the db"); // Success message
    } catch (error) {
        console.error('Error deleting nodes:', error.message);
    }
})

// ((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)
