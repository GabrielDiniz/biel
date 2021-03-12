const Processor = require("./processor");
var readline = require('readline');
var resp = "";

const proc = new Processor();
var leitor = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const input = (msg) => {
	if(msg instanceof Array){
		m = msg.join("\n\n");
	}else{
		m=msg;
	}
	leitor.question(m+"\n", function(answer) {
	   
	   proc.processa(answer).then(input);
	   
	});
}
input("");