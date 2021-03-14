module.exports = class Processor {
	constructor(id){

		const Menu = require("./Menu");
		this.menu = new Menu("./Menu.json");
		const Mensagem = require("./Mensagem");
		this.mensagem = new Mensagem(id);
		this.pedido=[];
		this.statusConversa = "inicio";
		this.itemPedidoAtual = {};
		
	
	}

	/**
	Contrla o fluxo principal do pedido
	*/

	processa = async (msg) => {
		switch(this.statusConversa){
			case "inicio":
				return this.apresentar(msg);
				break;
			case "apresentar":
				return this.exibirMenu(msg);
				break;
			case "exibir_menu":
				return this.exibeMenuCategoria(msg);
				break;
			case "exibe_menu_categoria":
				return this.exibirValoresProduto(msg);
				break;
			case "exibir_valores_produto":
				return this.exibirAcompanhamentos(msg,0);
				break;
			case "exibir_acompanhamentos":
				return this.exibirAcompanhamentos(msg,this.itemPedidoAtual.acompanhamentoAtual+1);
				break;
			case "exibir_extras":
				return this.exibirExtras(msg);
				break;
			case "confirmar_item":
				return this.confirmarItem(msg);
				break;
			case "listagem_pedido":
				return this.listarPedido(msg);
				break;
			case "remover_item":
				return this.listarPedido(msg);
				break;
			default:
				return this.default(msg);
		}
	}

	/**
	Reseta as vairiaveis para reinicair o pedido
	*/

	reiniciarPedidoAtual = () => {
		this.itemPedidoAtual = {};
		this.statusConversa="exibir_menu";
	}

	/**
	Exibe mensagem incial de boas vindas
	*/
	apresentar = (msg) =>{
		this.statusConversa="apresentar"
		return this.mensagem.getApresentacao();
	}

	/**
	Regitra e nome do cliente e;
	Exibe as opções de categorias principais
	*/

	exibirMenu = (msg) =>{
		this.pedido.nome_cliente = msg;
		this.mensagem.replaces.nome_cliente = msg;
		this.mensagem.replaces.categorias = this.mensagem.getListagemCategorias();
		this.statusConversa="exibir_menu";
		return this.mensagem.getOpcoesCategorias();
	}

	/**
	Registra a escolha da categoria e;
	Lista os produtos dessa categoria para escolha
	*/

	exibeMenuCategoria = (msg) =>{
		const categoria = Number(msg)-1;
		this.itemPedidoAtual.categoria = categoria;
		if (this.menu.getCategoria(this.itemPedidoAtual)===undefined) { //se opção de categoria escolhida for invalida
			return [this.mensagem.getItemInexistente(), this.mensagem.getOpcoesCategorias()];
		}else{
			this.statusConversa = "exibe_menu_categoria";
			this.mensagem.replaces.nome_categoria=this.menu.getCategoria(this.itemPedidoAtual).nome;
			this.mensagem.replaces.produtos=this.mensagem.getListagemProdutos(this.itemPedidoAtual);
			return this.mensagem.getOpcoesProdutos(categoria);
		}
	}

	/**
	Registra produto escolhido e;
	Caso houver mais de uma opção de valor pra esse produto, lista essas opções, e;
	Caso nao houver opções de valores pula para exibir os acompanhamentos disponiveis e;
	Caso nao houver acompanhamentos exbibe as opções extras e;
	Caso nao hover opções extras mostra a confirmacao do item atual;
	*/

	exibirValoresProduto = (msg) =>{
		const produto = Number(msg)-1;
		this.itemPedidoAtual.produto = produto;
		if (msg==="0") { //voltar ao inicio
			this.reiniciarPedidoAtual();
			return this.mensagem.getOpcoesCategorias();
		}else if (this.menu.getProduto(this.itemPedidoAtual)===undefined) { //se opção de produto digitada for invalida
			return [this.mensagem.getItemInexistente(), this.mensagem.getOpcoesProdutos()];
		}else{
			if (this.menu.getProduto(this.itemPedidoAtual).valores.length==1) {//verificar se existe mais de uma opção de valor pro produto escolhido
				this.itemPedidoAtual.valorProduto = 0; //caso tenha apenas uma opção de valores, ela é escolhida automaticamente e pula pra proxiam etapa
				this.mensagem.replaces.valor_produto_nome = this.menu.getValorProduto(this.itemPedidoAtual).nome;
				if (this.menu.getQtdAcompanhamentosProduto(this.itemPedidoAtual) > 0) { // verifica se o produto possui opções de acompanhamentos
					this.itemPedidoAtual.acompanhamentos=[];
					this.itemPedidoAtual.acompanhamentoAtual=0;
					this.mensagem.replaces.nome_acompanhamento = this.menu.getAcompanhamento(this.itemPedidoAtual).nome;
					this.mensagem.replaces.acompanhamentos_produto = this.mensagem.getListagemAcompanhamentos(this.itemPedidoAtual);
					this.statusConversa = "exibir_acompanhamentos";
					return this.mensagem.getAcompanhamentos();
				}else{ //caso nao possua pula para as opções extras
					if (this.menu.getExtrasProduto(this.itemPedidoAtual).length > 0) {//se o produto possui extras
						this.statusConversa = "exibir_extras";
						this.itemPedidoAtual.extras=[];
						this.mensagem.replaces.extras = this.mensagem.getListagemExtras(this.itemPedidoAtual);
						return this.mensagem.getExtras(this.itemPedidoAtual);
					}else{//se nao possui extras pula pra confirmacao do item atual
						this.statusConversa = "confirmar_item";//tratar confirmação de item
						return this.mensagem.getConfirmacaoItem(this.itemPedidoAtual);
					}
				}
			}
			this.statusConversa="exibir_valores_produto";
			this.mensagem.replaces.nome_produto = this.menu.getProduto(this.itemPedidoAtual).nome;
			this.mensagem.replaces.valores_produto = this.mensagem.getListagemValoresProdutos(this.itemPedidoAtual);
			return this.mensagem.getValoresProduto();
		}
	}




	/**
	Registra opção de valor escolhida e;
	Exibe os acompanhamentos disponiveis e;
	Caso nao houver acompanhamentos exbibe as opções extras e;
	Caso nao hover opções extras mostra a confirmacao do item atual;
	*/
	

	exibirAcompanhamentos = (msg,acompanhamentoAtual) =>{
		const opcao = Number(msg)-1;
		if (msg==="0") { //voltar ao inicio
			this.reiniciarPedidoAtual();
			return this.mensagem.getOpcoesCategorias();
		}
		if (acompanhamentoAtual === 0) {//acabou de decidir o produto e valor (caso houver opções), vai agora decidir os acompanhamentos (se houver)
			

			if(msg === "V" || msg === "v"){ //Voltar para tela anterior
				this.statusConversa = "exibe_menu_categoria";
				return this.mensagem.getOpcoesProdutos();
			}
			this.itemPedidoAtual.valorProduto = opcao;

			if (this.menu.getValorProduto(this.itemPedidoAtual)===undefined) { //digitopu opção invalida 
				return [this.mensagem.getItemInexistente(), this.mensagem.getValoresProduto()];
			}else {
				if (this.menu.getQtdAcompanhamentosProduto(this.itemPedidoAtual) > 0) { //produto escolhido possui opção de acompanhamento
					this.itemPedidoAtual.acompanhamentos=[];
					this.itemPedidoAtual.acompanhamentoAtual=0;
					this.mensagem.replaces.nome_acompanhamento = this.menu.getAcompanhamento(this.itemPedidoAtual).nome;
					this.mensagem.replaces.acompanhamentos_produto = this.mensagem.getListagemAcompanhamentos(this.itemPedidoAtual);
					this.mensagem.replaces.valor_produto_nome = this.menu.getValorProduto(this.itemPedidoAtual).nome;
					
					this.statusConversa = "exibir_acompanhamentos";
					return this.mensagem.getAcompanhamentos();
				}else{
					if (this.menu.getExtrasProduto(this.itemPedidoAtual)!=undefined && this.menu.getExtrasProduto(this.itemPedidoAtual).length > 0) {//se o produto possui extras
						this.statusConversa = "exibir_extras";
						this.itemPedidoAtual.extras=[];
						this.mensagem.replaces.extras = this.mensagem.getListagemExtras(this.itemPedidoAtual);
						return this.mensagem.getExtras(this.itemPedidoAtual);
					}else{//se nao possui extras pula pra confirmacao do item atual
						this.statusConversa = "confirmar_item";//tratar confirmação de item
						return this.mensagem.getConfirmacaoItem(this.itemPedidoAtual);
					}
				}
			}
		}else{ //trata as escolhas de acompanhamento
			if(msg === "V" || msg === "v"){//Voltar para tela anterior
				this.itemPedidoAtual.acompanhamentoAtual--;
				if (this.itemPedidoAtual.acompanhamentoAtual < 0) { //se for o primeiro acompanhamento volta pra listagem de produtos
					this.statusConversa = "exibe_menu_categoria";
					return this.mensagem.getOpcoesProdutos();
				}else{ // se nao for o primeiro volta pro anterior
					this.mensagem.replaces.nome_acompanhamento = this.menu.getAcompanhamento(this.itemPedidoAtual).nome;
					this.mensagem.replaces.acompanhamentos_produto = this.mensagem.getListagemAcompanhamentos(this.itemPedidoAtual);
					this.statusConversa = "exibir_acompanhamentos";
					return this.mensagem.getAcompanhamentos();
				}
			}

			this.itemPedidoAtual.acompanhamentos[this.itemPedidoAtual.acompanhamentoAtual]=opcao; //acompanhamento escolhido
			
			if (this.menu.getAcompanhamentoProduto(this.itemPedidoAtual) === undefined) { //se opção for invlida
				this.itemPedidoAtual.acompanhamentoAtual--;
				return [this.mensagem.getItemInexistente(),this.mensagem.getAcompanhamentos()];
			}else{
				this.itemPedidoAtual.acompanhamentoAtual=acompanhamentoAtual; //controle de quantas opções de acompanhamento ja foram escolhidas
				if (this.menu.getAcompanhamento(this.itemPedidoAtual)===undefined) { //se acabaram as opções de escolha, vai pras opções extras
					if (this.menu.getExtrasProduto(this.itemPedidoAtual)!=undefined && this.menu.getExtrasProduto(this.itemPedidoAtual).length > 0) {//se o produto possui extras
						this.statusConversa = "exibir_extras";
						this.itemPedidoAtual.extras=[];
						this.mensagem.replaces.extras = this.mensagem.getListagemExtras(this.itemPedidoAtual);
						return this.mensagem.getExtras(this.itemPedidoAtual);
					}else{//se nao possui extras pula pra confirmacao do item atual
						this.statusConversa = "confirmar_item";//tratar confirmação de item
						return this.mensagem.getConfirmacaoItem(this.itemPedidoAtual);
					}
				}else{//caso ainda tenham acompanhamentos a se escolhidos
					this.mensagem.replaces.nome_acompanhamento = this.menu.getAcompanhamento(this.itemPedidoAtual).nome;
					this.mensagem.replaces.acompanhamentos_produto = this.mensagem.getListagemAcompanhamentos(this.itemPedidoAtual);

					this.statusConversa = "exibir_acompanhamentos";
					return this.mensagem.getAcompanhamentos();
				}
			}
			


		}

	}

	/**
	Registra opção de item extra escolhida e;
	Mostra a confirmacao do item atual;
	*/

	exibirExtras = (msg) =>{
		
		const opcao = Number(msg)-1;
		this.itemPedidoAtual.extras.push(opcao);
		if (msg==="0") { //voltar ao inicio
			this.reiniciarPedidoAtual();
			return this.mensagem.getOpcoesCategorias();
		}else if(msg === "V" || msg === "v"){ //Voltar para tela anterior
			this.statusConversa = "exibe_menu_categoria";
			return this.mensagem.getOpcoesProdutos();
		}else if(msg === "N" || msg === "n" || msg === "C" || msg === "c" ){
			this.itemPedidoAtual.extras.pop();//remove a ultima opcao (navegação/confirmacao)
			this.statusConversa = "confirmar_item";//tratar confirmação de item
			return this.mensagem.getConfirmacaoItem(this.itemPedidoAtual);
		}else if (this.menu.getExtra(this.itemPedidoAtual) === undefined) {
			this.itemPedidoAtual.extras.pop();
			this.mensagem.replaces.extras = this.mensagem.getListagemExtras(this.itemPedidoAtual);
			return [this.mensagem.getItemInexistente(),this.mensagem.getExtras(this.itemPedidoAtual)];
		}else{
			this.mensagem.replaces.extras = this.mensagem.getListagemExtras(this.itemPedidoAtual);
			return this.mensagem.getExtras(this.itemPedidoAtual);
		}
	}

	confirmarItem = (msg) => {
		if(msg === "D" || msg === "d"){ //descartar produto
			this.reiniciarPedidoAtual();
			return this.mensagem.getOpcoesCategorias();
		}else if( msg === "C" || msg === "c" ){ //confirmar produto

			this.pedido.push(this.itemPedidoAtual);
			this.reiniciarPedidoAtual();
			this.statusConversa = "listagem_pedido";
			return this.mensagem.getListagemPedido(this.pedido);
		}else{
			return [this.mensagem.getItemInexistente(),this.mensagem.getConfirmacaoItem(this.itemPedidoAtual)];
		}

	}

	listarPedido = (msg) => {
		if(msg === "A" || msg === "a"){ //descartar produto
			this.reiniciarPedidoAtual();
			return this.mensagem.getOpcoesCategorias();
		}else if( msg === "R" || msg === "r" ){ //confirmar produto
			this.statusConversa="remover_item";
			return this.mensagem.getListagemPedidoRemover(this.pedido);
		}else if(this.statusConversa=="remover_item"){
			const opcao = Number(msg)-1;
			if (this.pedido[opcao]==undefined) {
				return [this.mensagem.getItemInexistente(),this.mensagem.getListagemPedidoRemover(this.pedido)];
			}else{
				this.pedido.splice(opcao,1);
				return this.mensagem.getListagemPedido(this.pedido);
			}
		}else{
			return [this.mensagem.getItemInexistente(),this.mensagem.getListagemPedido(this.pedido)];
		}
	}
	/**
	se tudo der errado....
	*/
	default = (msg) =>{
		this.statusConversa="apresentar"
		this.reiniciarPedidoAtual();
		return this.mensagem.getMensagemPane();
	}


}

