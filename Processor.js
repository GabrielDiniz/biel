const Menu = require("./menu");
const menu = new Menu("./menu.json");
module.exports = class Processor {
	constructor(){
		this.pedido={};
		this.statusConversa = "inicio";
		this.itemPedidoAtual = {};
		this.replaces=menu.getReplaces();
		this.navegacao = {
			voltar_menu_principal:"\n\n0 - {voltar_menu_principal}\n",
			voltar_menu_categorias:"\n\nV - {voltar_menu_categorias}\n"
		}
		//console.log(this.menu);

	}
	
	inicio = (msg) =>{
		this.statusConversa="apresentar"
		return this.printf(menu.getApresentacao());
	}

	apresentar = (msg) =>{
		this.pedido.nome_cliente = msg;
		this.replaces.nome_cliente = msg;
		this.statusConversa="exibir_menu";
		return this.getOpcoesCategorias();
	}

	exibirMenu = (msg) =>{
		const categoria = Number(msg)-1;
		this.itemPedidoAtual.categoria = categoria;
		if (menu.getCategoria(this.itemPedidoAtual)===undefined) {
			return [this.printf(menu.getItemInexistente()), this.getOpcoesCategorias()];
		}else{
			this.statusConversa = "exibe_menu_categoria";
			this.replaces.nome_categoria=menu.getCategoria(this.itemPedidoAtual).nome;
			return this.getOpcoesProdutos(categoria);
		}
	}

	exibeMenuCategoria = (msg) =>{
		const produto = Number(msg)-1;
		this.itemPedidoAtual.produto = produto;
		if (msg==="0") {
			this.reiniciarPedidoAtual();
			return this.getOpcoesCategorias();
		}else if (menu.getProduto(this.itemPedidoAtual)===undefined) {
			return [this.printf(menu.getItemInexistente()), this.getOpcoesProdutos()];
		}else{
			this.statusConversa="exibir_valores_produto";
			this.replaces.nome_produto = menu.getProduto(this.itemPedidoAtual).nome;
			return this.getValoresProduto();
		}
	}
	/**
	@TODO percorrer as varias opções de tipos de acompanhamentos de cada produto 
	Ex.: Hamburger: Molhos ou batatas

	no momento ele esta considerando apenas 1 acompanhamento por produto (errado)
	*/


	exibirValoresProduto = (msg) =>{
		const opcao = Number(msg)-1;
		this.itemPedidoAtual.opcao = opcao;
		if (msg==="0") {
			this.reiniciarPedidoAtual();
			return this.getOpcoesCategorias();
		}else if(msg === "V"){
			this.statusConversa = "exibe_menu_categoria";
			return this.getOpcoesProdutos();
		}else if (menu.getOpcaoProduto(this.itemPedidoAtual)===undefined) {
			return [this.printf(menu.getItemInexistente()), this.getValoresProduto()];
		}else {
			this.statusConversa = "exibir_acompanhamentos";
			this.replaces.opcao = menu.getOpcaoProduto(this.itemPedidoAtual).nome;
			return menu.getAcompanhamentos();
		}
	}

	default = (msg) =>{
		this.statusConversa="apresentar"
		return this.printf(menu.getMensagemPane());
	}

	processa = async (msg) => {
		switch(this.statusConversa){
			case "inicio":
				return this.inicio(msg);
				break;
			case "apresentar":
				return this.apresentar(msg);
				break;
			case "exibir_menu":
				return this.exibirMenu(msg);
				break;
			case "exibe_menu_categoria":
				return this.exibeMenuCategoria(msg);
				break;
			case "exibir_valores_produto":
				return this.exibirValoresProduto(msg);
				break;
			default:
				return this.default(msg);
		}
	}

	reiniciarPedidoAtual = () => {
		this.itemPedidoAtual = {};
		this.statusConversa="exibir_menu";
	}

	printf = (string) => {
		for(let key in this.replaces){
			let bkey = "{"+key+"}";
			string = string.replace(bkey,this.replaces[key]);
		};
		return string;
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
}

