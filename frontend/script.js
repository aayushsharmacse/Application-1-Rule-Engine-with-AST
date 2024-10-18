console.log("inside js")

const createAST=(modifiedInput)=>{
    
    modifiedInput=modifiedInput.trim();
    modifiedInput=modifiedInput.slice(1, -1);
    const n=modifiedInput.length;
    let bracketCnt=0;
    for(let i=0;i<n;i++){
        // (bracketCnt==0 && modifiedInput[i]!='(' && modifiedInput[i]!=' ')  && console.log(bracketCnt,modifiedInput[i]);
        if(bracketCnt===0 && modifiedInput[i]!=='(' && modifiedInput[i]!==' ' && (modifiedInput[i]==='A' || modifiedInput[i]==='O') ){
            if(modifiedInput[i]+modifiedInput[i+1]+modifiedInput[i+2]==="AND"){
                console.log("AND")
                console.log("left-",modifiedInput.slice(0,i),"end")
                console.log("right-",modifiedInput.slice(i+3),"end")
                const left=createAST(modifiedInput.slice(0,i));
                const right=createAST(modifiedInput.slice(i+3))
            }
            else if(modifiedInput[i]+modifiedInput[i+1]==="OR"){
                console.log("OR")
                console.log("left-",modifiedInput.slice(0,i),"end")
                console.log("right-",modifiedInput.slice(i+2),"end")
                const left=createAST(modifiedInput.slice(0,i));
                const right=createAST(modifiedInput.slice(i+2))
            }
            else{
                console.log("Wrong rule input");
            }
            break;
        }
        // console.log(modifiedInput[i]);
        if(modifiedInput[i]=='('){
            bracketCnt++;
        }
        else if(modifiedInput[i]==')'){
            bracketCnt--;
        }
    }
}

const create_rule=async(rule_string)=>{
    // console.log(rule_string)
    const modifiedInput="("+rule_string+")"
    // console.log(modifiedInput)
    const ASTNode=createAST(modifiedInput)
}
const createRuleElement=document.getElementsByClassName("create")[0];
const combineRulesElement=document.getElementsByClassName("combine")[0];
const evaluateRuleElement=document.getElementsByClassName("evaluate")[0];
createRuleElement.addEventListener("click",
    (e)=>{
        console.log("create rule event fired");
        const input=prompt("Please enter the rule you wish to create");
        create_rule(input);
    }
)
combineRulesElement.addEventListener("click",
    (e)=>{console.log("combine rules event fired")}
)
evaluateRuleElement.addEventListener("click",
    (e)=>{console.log("evaluate rule event fired")}
)
// ((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)