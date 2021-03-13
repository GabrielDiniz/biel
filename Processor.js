const Menu = require("./Menu");
const menu = new Menu("./Menu.json");
const Mensagem = require("./Mensagem");
var mensagem;
module.exports = class Processor {
	constructor(){
		this.pedido={};
		this.statusConversa = "inicio";
		this.itemPedidoAtual = {};
		mensagem = new Mensagem();
		
		//console.log(this.menu);

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
		return mensagem.getApresentacao();
	}

	exibirMenu = (msg) =>{
		this.pedido.nome_cliente = msg;
		mensagem.replaces.nome_cliente = msg;
		this.statusConversa="exibir_menu";
		return mensagem.getOpcoesCategorias();
	}

	exibeMenuCategoria = (msg) =>{
		const categoria = Number(msg)-1;
		this.itemPedidoAtual.categoria = categoria;
		if (menu.getCategoria(this.itemPedidoAtual)===undefined) {
			return [mensagem.getItemInexistente(), mensagem.getOpcoesCategorias()];
		}else{
			this.statusConversa = "exibe_menu_categoria";
			mensagem.replaces.nome_categoria=menu.getCategoria(this.itemPedidoAtual).nome;
			return mensagem.getOpcoesProdutos(categoria);
		}
	}

	exibirValoresProduto = (msg) =>{
		const produto = Number(msg)-1;
		this.itemPedidoAtual.produto = produto;
		if (msg==="0") {
			this.reiniciarPedidoAtual();
			return mensagem.getOpcoesCategorias();
		}else if (menu.getProduto(this.itemPedidoAtual)===undefined) {
			return [mensagem.getItemInexistente(), mensagem.getOpcoesProdutos()];
		}else{
			this.statusConversa="exibir_valores_produto";
			mensagem.replaces.nome_produto = menu.getProduto(this.itemPedidoAtual).nome;
			return mensagem.getValoresProduto();
		}
	}
	/**
	@TODO parar de exibir os acompanhamentos quando terminar a lista de escolhas possiveis [molho, fritas... exception]
	*/


	exibirAcompanhamentos = (msg,acompanhamentoAtual) =>{
		const opcao = Number(msg)-1;
		if (acompanhamentoAtual === 0) {
			this.itemPedidoAtual.acompanhamentos=[];
			this.itemPedidoAtual.acompanhamentoAtual=0;
			this.itemPedidoAtual.valorProduto = opcao;
			mensagem.replaces.nome_acompanhamento = menu.getAcompanhamentoNome(this.itemPedidoAtual);

			if (msg==="0") {
				this.reiniciarPedidoAtual();
				return mensagem.getOpcoesCategorias();
			}else if(msg === "V"){
				this.statusConversa = "exibe_menu_categoria";
				return mensagem.getOpcoesProdutos();
			}else if (menu.getValorProduto(this.itemPedidoAtual)===undefined) {
				return [mensagem.getItemInexistente(), mensagem.getValoresProduto()];
			}else {
				if (menu.getQtdAcompanhamentosProduto(this.itemPedidoAtual) > 0) {
					mensagem.replaces.valor_produto_nome = menu.getValorProduto(this.itemPedidoAtual).nome;
					
					this.statusConversa = "exibir_acompanhamentos";
					return mensagem.getAcompanhamentos();
				}else{
					this.statusConversa = "exibir_extras";
					return mensagem.exibirExtras();
				}
			}
		}else{

			/*
			 @TODO !!!!
			 tratamentos da opção escolhida de acompanhamentos
			*/
			this.itemPedidoAtual.acompanhamentos[acompanhamentoAtual-1]=opcao;
			this.itemPedidoAtual.acompanhamentoAtual=acompanhamentoAtual;
			mensagem.replaces.nome_acompanhamento = menu.getAcompanhamentoNome(this.itemPedidoAtual);
			this.statusConversa = "exibir_acompanhamentos";
			return mensagem.getAcompanhamentos();
		}

	}

	exibirExtras = (msg,extraAtual) =>{
		/*
		@TODO !!! 
		tratar eventualidade do item atual nao possuir acompanhamento na etapa anterior
		*/

	}

	default = (msg) =>{
		this.statusConversa="apresentar"
		return mensagem.getMensagemPane();
	}


}

