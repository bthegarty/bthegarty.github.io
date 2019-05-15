function testCaseOne(){
  document.getElementById("inputText").value += '{' + '\n'
  document.getElementById("inputText").value += 'int a' + '\n'
  document.getElementById("inputText").value += 'a = 5' + '\n'
  document.getElementById("inputText").value += 'boolean b' + '\n'
  document.getElementById("inputText").value += 'b = true' + '\n'
  document.getElementById("inputText").value += 'string c' + '\n'
  document.getElementById("inputText").value += 'c = "alan"' + '\n'
  document.getElementById("inputText").value += 'print (a)' + '\n'
  document.getElementById("inputText").value += 'print (b)' + '\n'
  document.getElementById("inputText").value += 'print (c)' + '\n'
  document.getElementById("inputText").value += '{' + '\n'
  document.getElementById("inputText").value += 'int d' + '\n'
  document.getElementById("inputText").value += 'd = 6' + '\n'
  document.getElementById("inputText").value += 'string e' + '\n'
  document.getElementById("inputText").value += 'e = "cgen"' + '\n'
  document.getElementById("inputText").value += 'boolean f' + '\n'
  document.getElementById("inputText").value += 'f = false' + '\n'
  document.getElementById("inputText").value += 'print (d)' + '\n'
  document.getElementById("inputText").value += 'print (e)' + '\n'
  document.getElementById("inputText").value += 'print (f)' + '\n'
  document.getElementById("inputText").value += '}' + '\n'
  document.getElementById("inputText").value += '}$' + '\n'
}

function testCaseTwo(){
  document.getElementById("inputText").value += '{' + '\n'
  document.getElementById("inputText").value += 'int a' + '\n'
  document.getElementById("inputText").value += 'string b' + '\n'
  document.getElementById("inputText").value += 'a = 5' + '\n'
  document.getElementById("inputText").value += 'b = "this is a test"' + '\n'
  document.getElementById("inputText").value += '{' + '\n'
  document.getElementById("inputText").value += 'boolean c' + '\n'
  document.getElementById("inputText").value += '}' + '\n'
  document.getElementById("inputText").value += '}$' + '\n'
}

//unrecognised token. String needs to be in qoutes
// will fail anyway because boolean and its value are out of scope
function testCaseThree(){
  document.getElementById("inputText").value += '{' + '\n'
  document.getElementById("inputText").value += 'int a' + '\n'
  document.getElementById("inputText").value += 'string b' + '\n'
  document.getElementById("inputText").value += 'a = 5' + '\n'
  document.getElementById("inputText").value += 'b = hi' + '\n'
  document.getElementById("inputText").value += 'c = true' + '\n'
  document.getElementById("inputText").value += '{' + '\n'
  document.getElementById("inputText").value += 'boolean c' + '\n'
  document.getElementById("inputText").value += '}' + '\n'
  document.getElementById("inputText").value += '}$' + '\n'
}

// No end token. Fails parse
function testCaseFour(){
  document.getElementById("inputText").value += '{' + '\n'
  document.getElementById("inputText").value += 'int a' + '\n'
  document.getElementById("inputText").value += 'string b' + '\n'
  document.getElementById("inputText").value += '}' + '\n'

}
