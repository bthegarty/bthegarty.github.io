// Brendan Hegarty
// existence is pain for a meeeseeeks, jerry!!
var astCounter = 0;//counter to move through that new double bouble tree
var AST = new Tree();//new tree now with double the AST
var semanticAST = [];//empty array that we can push to as we traverse the ast to store scope and type
var semanticAnalist = [];//empty array where we can store our symbol table
var scopeCounter = -1;//counter that will push us through this array
var array = [];//temp array for storage purposes and other shenanigans

//add descriptor to nodes for codegen

function addIdToTree(identifier){
	AST.addNode(identifier, 'leaf');
}

function traverseCST(node){

	if (!node.children || node.children.length == 0){

	}
	else{
			//There are children, so note these interior/branch nodes and...
			// ...recursively expand them.
			for (var i = 0; i < node.children.length; i++)
			{

					//debugger;
					if (node.children[i].name == 'Block'){
						console.log('if 1');
						astBlock();


				  }
					else if (node.children[i].name == 'VarDecl'){
						AST.addNode('VarDecl', 'branch');
						astType(node.children[i].children[0].children[0].name);

				    addIdToTree(node.children[i].children[1].children[0].children[0].name);
								semanticAST.push(node.children[i].children[0].children[0].name);
						    semanticAST.push(node.children[i].children[1].children[0].children[0].name);//push boolean to semanticAnalist
						    semanticAST.push(scopeCounter);//increment counter
						    semanticAST.push(false);//log false at first pass

						    scopeCheck();
						    semanticAST = [];
								AST.endChildren();

					}
					else if (node.children[i].name == 'PrintStatement'){
						AST.addNode('PrintStatement', 'branch')
				    astExpr(node.children[i].children[2]);

						AST.endChildren();

					}
					else if (node.children[i].name == 'IfStatement'){
            AST.addNode('IfStatement', 'branch')
						astBooleanExpr(node.children[i].children[1]);

					}
					else if (node.children[i].name == 'AssignmentStatement'){
            AST.addNode('AssignmentStatement', 'branch')
						addIdToTree(node.children[i].children[0].children[0].children[0].name);
						astExpr(node.children[i].children[2], true, astId(node.children[i].children[0].children[0].children[0].name));
					  AST.endChildren();
					}
					else if (node.children[i].name == 'WhileStatement'){
            AST.addNode('WhileStatement', 'branch')
						astBooleanExpr(node.children[i].children[1]);

					}
					else{
						console.log('Found: ' + node.children[i].name)
						// epsilon production
					}
					traverseCST(node.children[i]);
					if(node.children[i].name == 'Block'){
						scopeCounter--;//reverts back in scope number whenever we find a closing bracket
						AST.endChildren();
						if(node.name == 'IfStatement' | 'WhileStatement'){

							AST.endChildren()
						}
					}
			}
	}
}

function printSemanticAnalist(){
	for(var i = 0; i < semanticAnalist.length; i++){
		document.getElementById('outputCode').value += semanticAnalist[i] + "\n"
	}
}

function matchAndConsume (currTokenAST, astCounter){

	if(currTokenAST == tokenParse[astCounter][0]){

    console.log('Compairing ' + currTokenAST[0] + ' to the token in the array ' + tokenParse[astCounter][0]);
    document.getElementById('outputText').value += 'AST: Compairing ' + currTokenAST[0] + ' to the token in the array ' + tokenParse[astCounter][0] + "\n"
	}
	else{
		console.log('expected: ' + currTokenAST + ' Found: ' + tokenParse[astCounter][0])
    document.getElementById('outputText').value += 'AST: expected: ' + currTokenAST + ' Found: ' + tokenParse[astCounter][0] + "\n"
		//the log works just need to attach this to some kind of kill function
	}

}

function astBegin(){

  traverseCST(CST.root);
	document.getElementById('outputAST').value += AST.toString() + "\n"
	console.log(AST.toString());
	printSemanticAnalist();
	codeGenBegin();
}

function astProgram(){
	console.log('were in program');
  astBlock();
	console.log(AST.toString());
	astCounter++;

}

function astBlock(){
  //scope checking begins here
	console.log('we made it to block');
  AST.addNode('Block', 'branch');
  scopeCounter++;//scope counter starts at 0 and increases every time we find a {}
	astCounter++; // denotes new scope


	astCounter++;

}

function astStatementList(){
	console.log('statementlist');
  if (tokenParse[astCounter][0] == 'print'){
		console.log('if 1');
    astStatement();

    astStatementList();

  }
	else if (tokenParse[astCounter][1] == 'identifier'){
		astStatement();

    astStatementList();

		console.log('if id');
	}
	else if (tokenParse[astCounter][0] == 'int'){
    astStatement();

		astStatementList();

	}
	else if (tokenParse[astCounter][0] == 'string'){
    astStatement();

		astStatementList();

	}
	else if (tokenParse[astCounter][0] == 'boolean'){
    astStatement();

		astStatementList();

	}
	else if (tokenParse[astCounter][1] == 'while'){
    astStatement();

		astStatementList();

	}
	else if (tokenParse[astCounter][1] == 'if'){
    astStatement();

		astStatementList();

	}
	else if (tokenParse[astCounter][0] == '{'){
		astStatement();

		astStatementList();

	}
	else if (tokenParse[astCounter][0] == '}'){
		console.log('this is nothing and thats okay')
		// epsilon production
	}
	else{
		console.log('Found: ' + tokenParse[astCounter][0])
		// epsilon production
	}

}

function astStatement(){
	console.log('statement');

  if (tokenParse[astCounter][0] == 'print'){
    astPrintStatement();

  }
  else if (tokenParse[astCounter][1] == 'identifier'){
		console.log('gotpastiD')
    astAssignmentStatement();

  }
	else if (tokenParse[astCounter][0] == 'int'){
		astVarDecl();

	}
	else if (tokenParse[astCounter][0] == 'string'){
			astVarDecl();

	}
	else if (tokenParse[astCounter][0] == 'boolean'){
			astVarDecl();

	}
  else if (tokenParse[astCounter][0] == 'while'){
    astWhileStatement();

  }
	else if (tokenParse[astCounter][0] == 'if'){
		astIfStatement();

	}
  else if (tokenParse[astCounter][0] == '{'){
    astBlock();

  }
	else{
		console.log('error');
	}

}

function astPrintStatement(){
	console.log('printState');
  AST.addNode('PrintStatement', 'branch');

	astCounter++;

	astCounter++;

	astExpr();

	astCounter++;

	AST.endChildren();
}

function astAssignmentStatement(){
	console.log('assignState');
  AST.addNode('AssignmentStatement', 'branch');

	var symbolArray = astId();
	if (symbolArray == null){
		console.log('Symbol definition errors')
	}
  else{

	    astCounter++;

	    astExpr(symbolArray, true);

  }
	AST.endChildren();
}

function astVarDecl(){
  AST.addNode('VarDecl', 'branch');
  astType();

  astId();
	AST.endChildren();
}

function astWhileStatement(){
  AST.addNode('WhileStatement', 'branch');

  astBooleanExpr();

  astBlock();
	AST.endChildren();
}

function astIfStatement(){
  AST.addNode('IfStatement', 'branch');
	AST.addNode(tokenParse[astCounter][0], 'leaf');
	astCounter++;

  astBooleanExpr();

  astBlock();
	AST.endChildren();
}

function astExpr(ExprNode, callAssignmentStatement, symbolArray){
	console.log('expr');
	if(callAssignmentStatement){
  	if(ExprNode.children[0].name == 'IntExpr'){
			console.log('got the digit');
			//force in a new node for digit. this will be our work around
			if (symbolArray[0] == 'int'){
				symbolArray[3] = true;
				astIntExpr(ExprNode.children[0]);
			}
			else if (ExprNode.children[0].children[0].children[0].name == "StringExpr"){
				document.getElementById('outputCode').value += 'Type Mismatch Error' + "\n"
				throw new Error ('Type Mismatch at IntExpr. Can not match string');
			}
			else{
				console.log('Type Mismatch error');
				printSemanticAnalist();
        document.getElementById('outputCode').value += 'Type Mismatch Error' + "\n"
				throw new Error('Type Mismatch at Digit');
			}
		}
		else if (ExprNode.children[0].name == 'StringExpr'){
			if (symbolArray[0] == 'string'){
				symbolArray[3] = true;
				console.log('got the string');
				astStringExpr(ExprNode.children[0]);
			}
			else{
				console.log('Type Mismatch error');
				console.log('Expected String. Found: ' + symbolArray[0]);
				printSemanticAnalist();
        document.getElementById('outputCode').value += 'Type Mismatch Error' + "\n"
        document.getElementById('outputCode').value += 'Expected String. Found: ' + symbolArray[0] + "\n"
				throw new Error('Type Mismatch at Sting');
			}
		}
		else if (ExprNode.children[0].name == 'BooleanExpr'){
			if (symbolArray[0] == 'boolean'){
				symbolArray[3] = true;
				console.log('got the boolean');
				astBooleanExpr(ExprNode.children[0]);
			}
			else{
				console.log('Type Mismatch error');
				console.log('Expected Boolean Expression. Found: ' + symbolArray[0]);
				printSemanticAnalist();
        document.getElementById('outputCode').value += 'Type Mismatch Error ' + "\n"
        document.getElementById('outputCode').value += 'Expected Boolean Expression. Found: ' + symbolArray[0] + "\n"
				throw new Error('Type Mismatch at Boolean');
			}
		}
		else if (ExprNode.children[0].name == 'Id'){
			//debugger;
			var symbolDos = astId();
			if (symbolDos == null){
				console.log('undefined id');
				printSemanticAnalist();
        document.getElementById('outputCode').value += 'Found an Undefined ID at: ' + (tokenParse[astCounter][0]) + "\n"
				throw new Error('We got an undefined id here, bothth');
			}
			//Sunday July 16, 2017. Meet me by the Central Park boat house. Ill be wearing the red sun hat
			else if (symbolDos[3]){
				if (symbolArray[0] == symbolDos[0]){
					console.log('checking for errors here fam');

				}
				else{
					console.log("Type Mismatch Error");
					printSemanticAnalist();
          document.getElementById('outputCode').value += 'Type Mismatch Error' + "\n"
					throw new Error('Identifier ' + symbolDos[1] + 'is not the correct type. Expected type: ' + symbolArray[0]);
				}
			}
			else{
				console.log('Warning: uninitailized variable');
				printSemanticAnalist();
        document.getElementById('outputCode').value += 'Warning: uninitailized variable' + (tokenParse[astCounter][0]) + "\n"
				throw new Error('We got an uninitalized variable here, bothth' + symbolDos[1]);
			}

		}
	}
	else{
		if(ExprNode.children[0].name == 'IntExpr'){
			astIntExpr(ExprNode.children[0]);

			if (ExprNode.children[0].children[0].children[0].name == "StringExpr"){
				document.getElementById('outputCode').value += 'Type Mismatch Error' + "\n"
				throw new Error ('Type Mismatch at IntExpr. Can not match string');
			}
		}
		else if (ExprNode.children[0].name == 'StringExpr'){

			astStringExpr(ExprNode.children[0]);

		}
		else if (ExprNode.children[0].name == 'BooleanExpr'){

			astBooleanExpr(ExprNode.children[0]);

		}
		else if (ExprNode.children[0].name == 'Id'){

			var symbolDos = astId(ExprNode.children[0].children[0].children[0].name);
			if (symbolDos == null){
				console.log('undefined id');
				printSemanticAnalist();
        document.getElementById('outputCode').value += 'Unintalized id ' + (tokenParse[astCounter][0])  + "\n"
				throw new Error('We got another undefined id here, bothth');
			}
			else{
				AST.addNode(ExprNode.children[0].children[0].children[0].name);
				//epsilon produciton
			}
		}
	}
}

//*****************************************************************************
function astIntExpr(IntExprNode){
	console.log('intexpr')

	console.log('current: ' + tokenParse[astCounter+1][0]);
  if (IntExprNode.children[1]){
		console.log('current: ' + tokenParse[astCounter+1][0]);
		astIntOp(IntExprNode.children[1]);
		astDigit(IntExprNode.children[0]);
		astExpr(IntExprNode.children[2]);

		AST.endChildren();

	}
	else{
		AST.addNode(IntExprNode.children[0].children[0].name, 'leaf');
	}
}

function astStringExpr(StringExprNode){

	AST.addNode(StringExprNode.children[1].children[0].children[0].name, 'leaf');

}

function astBooleanExpr(BooleanExprNode){
console.log("boolean expr we in it");
	if (BooleanExprNode.children[0].name == 'BoolVal'){
		AST.addNode(BooleanExprNode.children[0].children[0].name, 'leaf');

	}

	else{
		astBoolOp(BooleanExprNode.children[2]);
		astExpr(BooleanExprNode.children[1]);
		astExpr(BooleanExprNode.children[3]);
		AST.endChildren();
	}

}

function astId(identifier){
  //tpe checking for single id's
  //cant have int a & string a in the same scope
	var identifierCheck = tokenParse[astCounter][0]; //run first id check
	var idCheck = false; //set to false on first pass
  var i = semanticAnalist.length -1;
  for( ;i > -1; i--){ //check table for id
    if(identifier == semanticAnalist[i][1] && semanticAnalist[i][2] <= scopeCounter){//check id info
      idCheck = true;
      break
    }
  }

  if(idCheck){
    return semanticAnalist[i]; //return table on id check
  }
  else{
    return null;
  }
}

function astCharList(){

	if (tokenParse[astCounter][1] == 'StringExpr'){
		astChar();

  	astCharList();


	}

  else{
  // epsilon production
	}
}
//the madness has sunk in at this point. She has gotten into my head. I wonder who is writing the code that appears before you. Is it still brendan or has the darkness overcome the personallity. Time will tell...

function astType(type){
	AST.addNode(type, 'leaf');
  //type checking starts here considering it needs to be an int/string/bool

}

//add descriptor to nodes for codegen
function astDigit(DigitNode){
	AST.addNode(DigitNode.children[0].name, 'leaf');

}

function astBoolOp(BoolOpNode){
	AST.addNode(BoolOpNode.children[0].name, 'branch');

}

function astBoolVal(){
	if (tokenParse[astCounter][1] == 'false'){
		matchAndConsume('false', astCounter)
		AST.addNode(tokenParse[astCounter][0], 'leaf');
		astCounter++;
	}
	else if (tokenParse[astCounter][1] == 'true'){
		matchAndConsume('true', astCounter);
		AST.addNode(tokenParse[astCounter][0], 'leaf');
		astCounter++;
	}
}

function astIntOp(IntOpNode){
	AST.addNode(IntOpNode.children[0].name, 'branch');

}

function scopeCheck(){
  //scopeCheck allows for more indepth error checking in the ast
  if(semanticAnalist.length == 0){
    semanticAnalist.push(semanticAST);//create our symbol table in an array
    console.log(semanticAnalist);
    console.log(array);
  }
  else{
    var checksemanticAnalist = false; // declare false and convert to true in tree traversal
		var i = 0;
		for ( ; i < semanticAnalist.length; i++){
      var interior = semanticAnalist[i];
      if (semanticAST[1] == semanticAnalist[i][1] && semanticAST[2] == semanticAnalist[i][2]){

        checksemanticAnalist = true;
        break;
      }

    }
    if (checksemanticAnalist){
      console.log('Scope/Type interference'); //generic error throw for improper definition
      document.getElementById('outputCode').value += 'Scope/Type interference ' + semanticAnalist[i][1] + ' already defined' + "\n"
    }
    else{
      semanticAnalist.push(semanticAST);
      console.log(semanticAnalist);//if no error throw the array to conosle
      

    }
  }
}

//Your tree traversal remains so we can AST
function Tree() {
    // Attributes

    this.root = null;  // Note the NULL root node of this tree.
    this.cur = {};     // Note the EMPTY current node of the tree we're building.

    // -- Methods --

    // Add a node: kind in {branch, leaf}.
    this.addNode = function(name, kind, type) {
        // Construct the node object.
        var node = { name: name,
                     children: [],
                     parent: {},
										 type: type
                   };

        // Check to see if it needs to be the root node.
        if ( (this.root == null) || (!this.root) )
        {
            // We are the root node.
            this.root = node;
        }
        else
        {
            // We are the children.
            // Make our parent the CURrent node...
            node.parent = this.cur;
            // and add ourselves (via the unfortunately-named
            // "push" function) to the children array of the current node.
            this.cur.children.push(node);
        }
        // If we are an interior/branch node, then...
        if (kind == "branch")
        {
            // ... update the CURrent node pointer to ourselves.
            this.cur = node;
        }
    };

    // Note that we're done with this branch of the tree...
    this.endChildren = function() {
        // ...by moving "up" to our parent node (if possible).
        if ((this.cur.parent !== null) && (this.cur.parent.name !== undefined))
        {
            this.cur = this.cur.parent;
        }
        else
        {
            // TODO: Some sort of error logging.
            // This really should not happen, but it will, of course.
        }
    };

    // Return a string representation of the tree.
    this.toString = function() {
        // Initialize the result string.
        var traversalResult = "";

        // Recursive function to handle the expansion of the nodes.
        function expand(node, depth)
        {
            // Space out based on the current depth so
            // this looks at least a little tree-like.
            for (var i = 0; i < depth; i++)
            {
                traversalResult += "-";
            }

            // If there are no children (i.e., leaf nodes)...
            if (!node.children || node.children.length === 0)
            {
                // ...note the leaf node.
                traversalResult += "[" + node.name + "]";
                traversalResult += "\n";
            }
            else
            {
                //There are children, so note these interior/branch nodes and...
                traversalResult += "<" + node.name + "> \n";
                // ...recursively expand them.
                for (var i = 0; i < node.children.length; i++)
                {
                    expand(node.children[i], depth + 1);
                }
            }
        }
        // Make the initial call to expand from the root.
        expand(this.root, 0);
        // Return the result.
        return traversalResult;
    };
}
