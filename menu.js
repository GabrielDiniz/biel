module.exports = class Menu{
	constructor(file){
		let json = require(file);
		this.content = JSON.parse(JSON.stringify(json));
	}

	getLabelCategorias = () =>{
		let ret = [];
		this.content.categorias_menu.forEach((categoria)=>{
			ret.push(categoria.nome);
		});	
		return ret;
	}
	getLabelProdutos = (pedido) =>{
		let ret = [];
		this.content.categorias_menu[pedido.categoria].itens.forEach((produto)=>{
			ret.push({
				nome:produto.nome,
				descricao:produto.descricao,
				valor:produto.valores[0].valor
			});
		});	
		return ret;
	}

	getLabelValoresProdutos = (pedido) =>{
		let ret = [];
		this.content.categorias_menu[pedido.categoria].itens[pedido.produto].valores.forEach((valor)=>{
			ret.push(valor);
		});	
		return ret;
	}

	getLabelAcompanhamentos = (pedido) => {
		let ret = [];
		this.content.categorias_menu[pedido.categoria].acompanhamentos[pedido.acompanhamentoAtual].opcoes.forEach((acompanhamento)=>{
			ret.push(acompanhamento);
		});	
		return ret;	
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
		if (this.content.categorias_menu[pedido.categoria].acompanhamentos != undefined) {
			return this.content.categorias_menu[pedido.categoria].acompanhamentos.length;
		}else{
			return 0;
		}
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