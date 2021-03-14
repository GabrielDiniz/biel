const Processor = require('./Processor');
module.exports = class Queue {
	constructor(){
		this.queue={};
	}

	getItem = (id) =>{

		if (this.queue[id] == undefined) {
			this.queue[id] = new Processor(id);
		}
		return this.queue[id];

	}
}