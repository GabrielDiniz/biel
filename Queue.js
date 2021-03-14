const Processor = require('./Processor');
module.exports = class Queue {
	constructor(){
		this.queue={};
	}
	/**
	responsavel por controlar a fila de atendimento e tratar concorrencia de dois pedidos sendo feitos simultaneamente
	cada cliente possui um objeto processador diferente vinculado ao seu id
	*/
	getItem = (id) =>{

		if (this.queue[id] == undefined) {
			this.queue[id] = new Processor(id);
		}
		return this.queue[id];

	}
}