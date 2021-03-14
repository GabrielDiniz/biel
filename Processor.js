module.exports = class Processor {
	constructor(id){

		const Menu = require("./Menu");
		this.menu = new Menu("./Menu.json");
		const Mensagem = require("./Mensagem");
		this.mensagem = new Mensagem(id);
		this.pedido={};
		this.statusConversa = "inicio";
		this.itemPedidoAtual = {};
		
	
	}

	

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
				return this.exibirExtras(msg,0);
			default:
				return this.default(msg);
		}
	}

	reiniciarPedidoAtual = () => {
		this.itemPedidoAtual = {};
		this.statusConversa="exibir_menu";
	}

	apresentar = (msg) =>{
		this.statusConversa="apresentar"
		return this.mensagem.getApresentacao();
	}

	exibirMenu = (msg) =>{
		this.pedido.nome_cliente = msg;
		this.mensagem.replaces.nome_cliente = msg;
		this.mensagem.replaces.categorias = this.mensagem.getListagemCategorias();
		this.statusConversa="exibir_menu";
		return this.mensagem.getOpcoesCategorias();
	}

	exibeMenuCategoria = (msg) =>{
		const categoria = Number(msg)-1;
		this.itemPedidoAtual.categoria = categoria;
		if (this.menu.getCategoria(this.itemPedidoAtual)===undefined) {
			return [this.mensagem.getItemInexistente(), this.mensagem.getOpcoesCategorias()];
		}else{
			this.statusConversa = "exibe_menu_categoria";
			this.mensagem.replaces.nome_categoria=this.menu.getCategoria(this.itemPedidoAtual).nome;
			this.mensagem.replaces.produtos=this.mensagem.getListagemProdutos(this.itemPedidoAtual);
			return this.mensagem.getOpcoesProdutos(categoria);
		}
	}


	/*
	@TODO!!!!
	Tratar quando não há acompanhamentos
	*/

	exibirValoresProduto = (msg) =>{
		const produto = Number(msg)-1;
		this.itemPedidoAtual.produto = produto;
		if (msg==="0") {
			this.reiniciarPedidoAtual();
			return this.mensagem.getOpcoesCategorias();
		}else if (this.menu.getProduto(this.itemPedidoAtual)===undefined) {
			return [this.mensagem.getItemInexistente(), this.mensagem.getOpcoesProdutos()];
		}else{
			if (this.menu.getProduto(this.itemPedidoAtual).valores.length==1) {
				this.itemPedidoAtual.valorProduto = 0;
				this.mensagem.replaces.valor_produto_nome = this.menu.getValorProduto(this.itemPedidoAtual).nome;
				this.itemPedidoAtual.acompanhamentos=[];
				this.itemPedidoAtual.acompanhamentoAtual=0;
				this.mensagem.replaces.nome_acompanhamento = this.menu.getAcompanhamento(this.itemPedidoAtual).nome;
				this.mensagem.replaces.acompanhamentos_produto = this.mensagem.getListagemAcompanhamentos(this.itemPedidoAtual);
				this.statusConversa = "exibir_acompanhamentos";
				return this.mensagem.getAcompanhamentos();
			}
			this.statusConversa="exibir_valores_produto";
			this.mensagem.replaces.nome_produto = this.menu.getProduto(this.itemPedidoAtual).nome;
			this.mensagem.replaces.valores_produto = this.mensagem.getListagemValoresProdutos(this.itemPedidoAtual);
			return this.mensagem.getValoresProduto();
		}
	}
	/*
	@TODO!!!!
	Tratar quando não há acompanhamentos
	*/

	exibirAcompanhamentos = (msg,acompanhamentoAtual) =>{
		const opcao = Number(msg)-1;
		if (msg==="0") {
			this.reiniciarPedidoAtual();
			return this.mensagem.getOpcoesCategorias();
		}
		if (acompanhamentoAtual === 0) {
			

			if(msg === "V"){
				this.statusConversa = "exibe_menu_categoria";
				return this.mensagem.getOpcoesProdutos();
			}
			this.itemPedidoAtual.acompanhamentos=[];
			this.itemPedidoAtual.acompanhamentoAtual=0;
			this.itemPedidoAtual.valorProduto = opcao;
			this.mensagem.replaces.nome_acompanhamento = this.menu.getAcompanhamento(this.itemPedidoAtual).nome;
			this.mensagem.replaces.acompanhamentos_produto = this.mensagem.getListagemAcompanhamentos(this.itemPedidoAtual);

			if (this.menu.getValorProduto(this.itemPedidoAtual)===undefined) {
				return [this.mensagem.getItemInexistente(), this.mensagem.getValoresProduto()];
			}else {
				if (this.menu.getQtdAcompanhamentosProduto(this.itemPedidoAtual) > 0) {
					this.mensagem.replaces.valor_produto_nome = this.menu.getValorProduto(this.itemPedidoAtual).nome;
					
					this.statusConversa = "exibir_acompanhamentos";
					return this.mensagem.getAcompanhamentos();
				}else{
					this.statusConversa = "exibir_extras";
					return this.mensagem.exibirExtras();
				}
			}
		}else{
			if(msg === "V"){
				this.itemPedidoAtual.acompanhamentoAtual--;
				if (this.itemPedidoAtual.acompanhamentoAtual < 0) {
					this.statusConversa = "exibe_menu_categoria";
					return this.mensagem.getOpcoesProdutos();
				}else{
					this.mensagem.replaces.nome_acompanhamento = this.menu.getAcompanhamento(this.itemPedidoAtual).nome;
					this.mensagem.replaces.acompanhamentos_produto = this.mensagem.getListagemAcompanhamentos(this.itemPedidoAtual);
					this.statusConversa = "exibir_acompanhamentos";
					return this.mensagem.getAcompanhamentos();
				}
			}

			this.itemPedidoAtual.acompanhamentos[this.itemPedidoAtual.acompanhamentoAtual]=opcao;
			
			if (this.menu.getAcompanhamentoProduto(this.itemPedidoAtual) === undefined) {
				this.itemPedidoAtual.acompanhamentoAtual--;
				return [this.mensagem.getItemInexistente(),this.mensagem.getAcompanhamentos()];
			}else{
				this.itemPedidoAtual.acompanhamentoAtual=acompanhamentoAtual;
				if (this.menu.getAcompanhamento(this.itemPedidoAtual)===undefined) {
					this.statusConversa = "exibir_extras";
					return this.mensagem.getExtras();
				}else{
					this.mensagem.replaces.nome_acompanhamento = this.menu.getAcompanhamento(this.itemPedidoAtual).nome;
					this.mensagem.replaces.acompanhamentos_produto = this.mensagem.getListagemAcompanhamentos(this.itemPedidoAtual);

					this.statusConversa = "exibir_acompanhamentos";
					return this.mensagem.getAcompanhamentos();
				}
			}
			


		}

	}

	exibirExtras = (msg,extraAtual) =>{
		/*
		@TODO !!! 
		tratar eventualidade do item atual nao possuir acompanhamento na etapa anterior
		*/
		return "Extras!!!!!";
	}

	default = (msg) =>{
		this.statusConversa="apresentar"
		return this.mensagem.getMensagemPane();
	}


}

