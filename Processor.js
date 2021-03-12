const Menu = require("./menu");
const menu = new Menu("./menu.json");
module.exports = class Processor {
	constructor(){
		this.pedido={};
		this.statusConversa = "inicio";
		this.itemPedidoAtual = {};
		this.replaces=menu.getReplaces();
		this.navegacao = {
			voltar_menu_principal:"\n\n0 - {voltar_menu_principal}\n"
		}
		//console.log(this.menu);

	}
	

	processa = async (msg) => {
		switch(this.statusConversa){
			case "inicio":
				this.statusConversa="apresentar"
				return this.printf(menu.getApresentacao());
				break;
			case "apresentar":
				this.pedido.nome_cliente = msg;
				this.replaces.nome_cliente = msg;
				this.statusConversa="exibir_menu";
				return this.getOpcoesCategorias();
				break;
			case "exibir_menu":
				const categoria = Number(msg)-1;
				if (menu.getCategoria(categoria)===undefined) {
					return [this.printf(menu.getItemInexistente()), this.getOpcoesCategorias()];
				}else{
					this.itemPedidoAtual.categoria = categoria;
					this.statusConversa = "exibe_menu_categoria";
					this.replaces.nome_categoria=menu.getCategoria(categoria).nome;
					return this.getOpcoesProdutos(categoria);
				}
			case "exibe_menu_categoria":
				const produto = Number(msg)-1;
				if (msg==="0") {
					this.reiniciarPedidoAtual();
					return this.getOpcoesCategorias();
				}else if (menu.getProduto(this.itemPedidoAtual.categoria,produto)===undefined) {
					return [this.printf(menu.getItemInexistente()), this.getOpcoesProdutos(this.itemPedidoAtual.categoria)];
				}else{
					this.itemPedidoAtual.produto = produto;
					this.statusConversa="exibir_valores_produto";
					this.replaces.nome_produto = menu.getProduto(this.itemPedidoAtual.categoria,produto).nome;
					return this.getValoresProduto();
				}
				break;
			default:
				this.statusConversa="apresentar"
				return this.printf(menu.getMensagemPane());
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
		return this.printf(menu.getValoresProduto());
	}
}

