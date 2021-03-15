module.exports = class Menu{
	constructor(file){
		let json = require(file);
		this.content = JSON.parse(JSON.stringify(json));
	}

/**
retorna os itens do menu formatados para exibição
*/

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

	getLabelExtras = (pedido) =>{
		
		return this.content.categorias_menu[pedido.categoria].itens[pedido.produto].extras
		
	}


/**
retorna itens do menu completos
*/

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

	getExtra = (pedido) => {
		let extra_atual = pedido.extras[pedido.extras.length-1];
		return this.content.categorias_menu[pedido.categoria].itens[pedido.produto].extras[extra_atual];
	}

	getExtrasProduto = (pedido) => {
		
		return this.content.categorias_menu[pedido.categoria].itens[pedido.produto].extras;
	}



/**
confugurações de mensagens 
*/


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
	getExtras =()=>{
		return this.content.extras;
	}
	getRemoverItem = ()=>{
		return this.content.remover_item;	
	}
	getFormaPagamento = () =>{
		return this.content.forma_pagamento;
	}
	getEnderecoRua = () =>{
		return this.content.endereco_rua;
	}
	getEnderecoBairro = () =>{
		return this.content.endereco_bairro;
	}
	getEnderecoNumero = () =>{
		return this.content.endereco_numero;
	}
	getEnderecoComplemento = () =>{
		return this.content.endereco_comp;
	}
	getEnderecoReferencia = () =>{
		return this.content.endereco_ref;
	}
}
