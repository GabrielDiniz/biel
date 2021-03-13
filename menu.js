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
	getValorProduto = (pedido) => {
		return this.content.categorias_menu[pedido.categoria].itens[pedido.produto].valores[pedido.valorProduto];
	}
	getQtdAcompanhamentosProduto = (pedido) => {
		return this.content.categorias_menu[pedido.categoria].acompanhamentos.length;
	}
	getAcompanhamento = (pedido) =>{
		return this.content.categorias_menu[pedido.categoria].acompanhamentos[pedido.acompanhamentoAtual];
	}
	getAcompanhamentoProduto = (pedido) => {
		return this.content.categorias_menu[pedido.categoria].acompanhamentos[pedido.acompanhamentoAtual].opcoes[pedido.acompanhamentos[pedido.acompanhamentoAtual]];
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

	getAcompanhamentos = () =>{
		return this.content.acompanhamentos_produto;
	}
}