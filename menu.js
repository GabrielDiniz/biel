module.exports = class Menu{
	constructor(file){
		this.content = require(file);
	}
	getReplaces = () => {
		return this.content.replaces;
	}
	getApresentacao = () => {
		return this.content.apresentar;
	}

	getItemInexistente = () => {
		return this.content.item_inexistente;
	}

	getCategoria = (id) => {
		return this.content.categorias_menu[id];
	}

	getProduto = (categoria,produto) => {
		return this.content.categorias_menu[categoria].itens[produto];
	}
	getMensagemPane = () => {
		return this.content.mensagem_pane;
	}

	getOpcoesCategorias = () =>{
		return this.content.opcoes_categorias;
	}

	getOpcoesProdutos = () =>{
		return this.content.opcoes_produtos;
	}

	getValoresProduto = () =>{
		return this.content.valores_produto;
	}
}