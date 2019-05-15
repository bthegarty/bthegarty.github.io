//Brendan Hegarty
//Captain's Log: We have made it to codeGen and I'm gonna be honest... I never thought id make it this far

var byte = []; //this is an array with 256 availble slots
var heapCounter = 255; // counter will start at the end of our array and work back
var codePointer = 0; // starts at location 0 to keep track of memory
var variableAddress = []; //temp address for variables we enter
var staticTable = []; //stores all of the temp vars and addresses from variableAddress
var tempVarNum = 0; //keeps track of how many temp variables we have

function genOut(){
  for(var i = 0; i < 256; i++){//max of 256
    if(i%8 == 0 && i > 0){//allows for rows of 8
      document.getElementById('outputGen').value += "\n ";
    }
    document.getElementById('outputGen').value += byte[i] + " ";
    //string.format('%02x', byte[i]);//hex conversions
  }
}

function backPatch(){//so we can add many 00's
  for(var i = codePointer; i < heapCounter+1; i++){
    byte[i] = byte[i] || "00";
  }
  //fill all empty places in heap with 00
}

function substitute(){//will replace our T0 XX's
console.log(JSON.stringify(byte));
console.log("codePointer", codePointer);

  var howManyVariablesWeveSubtitedCount = 0;

  while(howManyVariablesWeveSubtitedCount < tempVarNum){
    console.log("var count " + howManyVariablesWeveSubtitedCount);

    for(var byteIndex = 0; byte.length > byteIndex; byteIndex++){
      console.log("bytes " + byte[byteIndex]);
      if(byte[byteIndex] == "T" + howManyVariablesWeveSubtitedCount){// When we find a Tx replace with location in stack

        byte[byteIndex] = (codePointer + howManyVariablesWeveSubtitedCount+1).toString(16).toUpperCase();
      }
      else if(byte[byteIndex] == "XX"){ //when we find XX replace with 00
        byte[byteIndex] = "00";
      }

    }
    howManyVariablesWeveSubtitedCount = howManyVariablesWeveSubtitedCount +1;
  }

}

function staticSearch(identifier){//remember that show static shock from the late 90's? i do. it was great
  var i = staticTable.length -1;//static table holds all of our temorary values like ine int a being convertted to t1 00
  for(;i > -1; i--){
    if(identifier == staticTable[i][1] && scopeCounter <= staticTable[i][2]){
      return staticTable[i];
      systemCall();
    }
  }
  return null;
  //this should never happen error
}//this searches the static table

function codeGenBegin(){
  traverseAST(AST.root);
  substitute();
  backPatch();
  genOut();
}

//We have to traverse AST to get to Code gen
function traverseAST(node){
  //add ability to parse leaf node here
	if (!node.children || node.children.length == 0){
    //posivly ignoring the node aspect
	}
	else{

			for (var i = 0; i < node.children.length; i++){

          if(node.children[i].name == 'Block'){
            scopeCounter++;
          }
					else if (node.children[i].name == 'VarDecl'){

						generateVar(node.children[i]);


				  }

					else if (node.children[i].name == 'PrintStatement'){
            //debugger;
				    generatePrint(node.children[i]);


					}
					// else if (node.children[i].name == 'IfStatement'){
					// 	generateIf(node.children[i].children[1]);

					// }
					else if (node.children[i].name == 'AssignmentStatement'){
						generateAssignment(node.children[i]);
					}

          // else if (node.children[i].name == undefined){
          //   generateConstant(node.children[i]);
          // }

					// else if (node.children[i].name == 'WhileStatement'){
					// 	generateWhile(node.children[i].children[1]);
					// }
					else{
						console.log('Found: ' + node.children[i].name)

						// epsilon production
					}
					traverseAST(node.children[i]);
          if(node.children[i].name == 'Block'){
            scopeCounter--;
          }
			}
	}
}

// these funcitons are for generation
function generatePrimitive(){
  loadAccWithConst("00");

}

function generateString(string) {

  var stringPointer = heapCounter - string.length;

  for(var i = 0; i < string.length; i++) {
    console.log(stringPointer + i, 'stringPointer + i')
    var code = string.charCodeAt(i).toString(16)
    byte[stringPointer + i] = code.toUpperCase();
  }

  return stringPointer.toString(16).toUpperCase();
}

function generateVar(VarDeclNode){

  var temp = "T" + tempVarNum++;//temp var for giving uninitalized vars the value of 0
  if(VarDeclNode.children[0].name == 'int' || VarDeclNode.children[0].name == 'boolean'){//these dont use the heap
    generatePrimitive();
    storeAccInMem(temp);
  }
  else if(VarDeclNode.children[0].name == 'string'){
    generatePrimitive();
    storeAccInMem(temp);
  }
  variableAddress.push(temp);
  variableAddress.push(VarDeclNode.children[1].name);
  variableAddress.push(scopeCounter);
  staticTable.push(variableAddress);
  variableAddress = [];
}

function generateAssignment(AssignmentStatementNode){
  var variableIdentifer = AssignmentStatementNode.children[0].name;
  var variableValue = AssignmentStatementNode.children[1].name;

  var staticTableEntry = staticSearch(variableIdentifer);
  var temporaryVariableLocation = staticTableEntry[0]; // T0 T1 T2

  var valueIsDigit = variableValue.search(T_digit) != -1;
  var valueIsString = variableValue.search(T_char) != -1;
  var valueIsBoolean = variableValue.search(T_true || T_false) != -1;//maybe (T_boolean)


  if(valueIsDigit) {
    loadAccWithConst("0" + variableValue.toString(16));
    storeAccInMem(temporaryVariableLocation);
  }
  else if(valueIsString) {
    var stringMemoryAddress = generateString(variableValue);
    loadAccWithConst(stringMemoryAddress);

    /* how do I get out of here? */
  }
  else if(valueIsBoolean){
    loadAccWithConst("0" + variableValue.toString(16));
    storeAccInMem(temporaryVariableLocation);
    /* handle boolean */
  }
}

//this is yet to be implemented

// function generateAssignment(AssignmentStatementNode){
//   //debugger;
//   var varAdd = staticSearch(AssignmentStatementNode.children[0].name);
//   var nodeName2 = AssignmentStatementNode.children[1].name;
//   //this should literally never be null
//   //i'll prob find a way to make this null tho
//   if(AssignmentStatementNode.children[1].name.search(T_digit) != -1){
//     //debugger;
//       console.log(AssignmentStatementNode.children[1].name.toString(16));
//       loadAccWithConst("0" + AssignmentStatementNode.children[1].name.toString(16));
//       storeAccInMem(varAdd[0]);
//       //loadYwithConst(varAdd[1]);
//   }
//   else if(nodeName2.search(T_string) != -1){
//     var stringAdd = generateString(nodeName2);
//       loadAccWithConst(AssignmentStatementNode.children[1].name.toString(16));
//
//   }
//   else if(AssignmentStatementNode.children[0].name.search(T_boolean) != -1){
//
//   }
//   //boolean and string will go here in the same if
// }

//maybe add some kind of function that adds undeclared ints like print(7)
//by calling to A0 and A2
// function generateConstant(digitNode){
//   var transformConstant = constantValue.toString(16);
//   //var digitAdd = staticSearch(digitNode.children[0].name);
//   if(digitNode.children[1].name.search(T_digit) != -1){
//       console.log(digitNode.children[1].name.toString(16));
//       loadAccWithConst(digitNode.children[1].name.toString(16));
//       loadYwithConst(digitAdd[1]);
//       loadXwithConst(digitAdd[0]);
//   }
// }

// function generateConstant(constantValue){
//   var registerValue = constantValue.toString(16);
//   loadYwithConst(registerValue);
// }

function generatePrint(PrintStatementNode){
  // debugger;
  var nodeName = PrintStatementNode.children[0].name;
  var varName = staticTable.find(function(entry){return nodeName == entry[1]});
  if(nodeName.search(T_digit) != -1){

      loadYwithConst("0" + nodeName.toString(16));
      loadXwithConst("01");
  }
  else if(varName){//var references

    loadYfromMem(varName[0]);
    loadXwithConst("01");
    //booleans seem to go through here right now.
    //if greater than ten it must be a string
  }
  else if(nodeName.search(T_true || T_false) != -1){
    //empty for boolean. idk if it's needed
  }
  else{
    var stringAddress = generateString(nodeName);
      loadYwithConst(stringAddress);
      loadXwithConst("02");
      //generateString(PrintStatementNode.children[0].name.toString(16));
  }
  systemCall();

}

function stringPrint(){

}

// function generateIf(IfStatement){
//
// }
//
// function generateWhile(WhileStatement){
//
// }


//These funcitons are for loading the byte array
//commented out is yet to be implemented


function loadAccWithConst(constant){
  byte[codePointer++] = "A9";
  byte[codePointer++] = constant;
  //codePointer += 2;
}

// function loadAccFromMem(accMem){
//   byte[codePointer++] = "AD";
//   byte[codePointer++] = accMem;
// }

function storeAccInMem(memory){
  //debugger;
  byte[codePointer++] = "8D";
  byte[codePointer++] = memory; // replaces the variable with xx for until we replace it with a location in the heap
  byte[codePointer++] = "XX";//break the string of stored inputs to find the variable
}

// function addWithCarry(carry){
//   byte[codePointer++] = "6D"
//   byte[codePointer++] = carry;
// }

function loadXwithConst(xConst){
  byte[codePointer++] = "A2";
  byte[codePointer++] = xConst;
}

// function loadXfromMem(xMem){
//   byte[codePointer++] = "AE";
//   byte[codePointer++] = xMem;
// }

function loadYwithConst(yConst){
  //used for simple print statements like print(6)
  byte[codePointer++] = "A0";
  byte[codePointer++] = yConst;
}

function loadYfromMem(yMem){
  byte[codePointer++] = "AC";
  byte[codePointer++] = yMem;
  byte[codePointer++] = "XX";
}

// function noOp(nothing){
//   byte[codePointer++] = "EA";
//   byte[codePointer++] = nothing;
// }

// function compareMemToXreg(xReg){
//   byte[codePointer++] = "EC";
//   byte[codePointer++] = xReg;
// }

// function branchByteToFlag(flag){
//   byte[codePointer++] = "D0";
//   byte[codePointer++] = flag;
// }

// function incrementByte(value){
//   byte[codePointer++] = "EE";
//   byte[codePointer++] = value;
// }

function systemCall(call){
  byte[codePointer++] = "FF";
  //byte[codePointer++] = call;
  //loadYfromMem(call);
  //call to table to print
}

// function storeString(end){
//   byte[codePointer++] = end;
//   byte[heapCounter--] = "";
//   heapCounter--;
// }

// function sysBreak(breakCall){
//   generatePrimitive(breakCall);
// }//places 00 at the end
