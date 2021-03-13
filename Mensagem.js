const Menu = require("./Menu");
const menu = new Menu("./menu.json");

module.exports =class Mensagem {
	constructor(){
		this.replaces = menu.getReplaces();
		this.navegacao = {
			voltar_menu_principal:"\n\n0 - {voltar_menu_principal}\n",
			voltar_menu_categorias:"\n\nV - {voltar_menu_categorias}\n",
			voltar_item:"\n\nV - {voltar_item}\n",
		}
	}

	printf = (string) => {
		for(let key in this.replaces){
			let bkey = "{"+key+"}";
			string = string.replace(bkey,this.replaces[key]);
		}
		return "\n\n\n"+string+"\n\n\n";
	}
	getMensagemPane = () =>{
		return this.printf(menu.getMensagemPane());
	}
	getItemInexistente = () =>{
		return this.printf(menu.getItemInexistente());
	}
	getApresentacao = () => {
		return this.printf(menu.getApresentacao());
	}
	getOpcoesCategorias = () =>{
		return this.printf(menu.getOpcoesCategorias());
	}

	getOpcoesProdutos = () =>{
		return this.printf(menu.getOpcoesProdutos()+this.navegacao.voltar_menu_principal);
	}

	getValoresProduto = ()  =>{
		return this.printf(menu.getValoresProduto()+this.navegacao.voltar_menu_categorias+this.navegacao.voltar_menu_principal);
	}
	getAcompanhamentos = () => {
		return this.printf(menu.getAcompanhamentos()+this.navegacao.voltar_item+this.navegacao.voltar_menu_principal)
	}

	getExtras = () => {
		return this.printf("extras");
	}
}