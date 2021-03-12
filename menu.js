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

	getCategoria = (pedido) => {
		return this.content.categorias_menu[pedido.categoria];
	}

	getProduto = (pedido) => {
		return this.content.categorias_menu[pedido.categoria].itens[pedido.produto];
	}
	getOpcaoProduto = (pedido) => {
		return this.content.categorias_menu[pedido.categoria].acompanhamentos.opcoes[pedido.opcao];
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