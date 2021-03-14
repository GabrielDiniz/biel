module.exports =class Mensagem {
	constructor(){
		const Menu = require("./Menu");
		this.menu = new Menu("./Menu.json");
		this.replaces = this.menu.getReplaces();
		this.navegacao = {
			voltar_menu_principal:"\n\n*0* - {voltar_menu_principal}\n",
			voltar_menu_categorias:"\n\n*V* - {voltar_menu_categorias}\n",
			voltar_item:"\n\n*V* - {voltar_item}\n",
		}
	}

	printf = (string) => {
		for(let key in this.replaces){
			let bkey = "{"+key+"}";
			string = string.replace(bkey,this.replaces[key]);
		}
		return "\n\n\n"+string+"\n\n\n";
	}
	formatNumber = (number,decimals)=> {
		return number.toLocaleString("pt-BR",{minimumFractionDigits:decimals,maximumFractionDigits:decimals});
	}
	getMensagemPane = () =>{
		return this.printf(this.menu.getMensagemPane());
	}
	getItemInexistente = () =>{
		return this.printf(this.menu.getItemInexistente());
	}
	getApresentacao = () => {
		return this.printf(this.menu.getApresentacao());
	}
	getOpcoesCategorias = () =>{
		return this.printf(this.menu.getOpcoesCategorias());
	}

	getOpcoesProdutos = () =>{
		return this.printf(this.menu.getOpcoesProdutos()+this.navegacao.voltar_menu_principal);
	}

	getValoresProduto = ()  =>{
		return this.printf(this.menu.getValoresProduto()+this.navegacao.voltar_menu_categorias+this.navegacao.voltar_menu_principal);
	}
	getAcompanhamentos = () => {
		return this.printf(this.menu.getAcompanhamentos()+this.navegacao.voltar_item+this.navegacao.voltar_menu_principal)
	}

	getExtras = () => {
		return this.printf("extras");
	}

	getListagemCategorias = () =>{
		const categorias = this.menu.getLabelCategorias();
		let listaCategorias="";
		categorias.forEach((categoria,key)=>{
			listaCategorias+="*"+(key+1)+"* - "+categoria+"\n";
		});
		return listaCategorias;
	}

	getListagemProdutos = (pedido) =>{
		const produtos = this.menu.getLabelProdutos(pedido);
		let listaProdutos="";
		produtos.forEach((produto,key)=>{
			listaProdutos+="*"+(key+1)+"* - *"+produto.nome+"*\n"+"_"+produto.descricao+"_\n```A partir de R$ "+(this.formatNumber(produto.valor,2))+"```\n\n";
		});
		return listaProdutos;
	}

	getListagemValoresProdutos = (pedido) => {
		const valores = this.menu.getLabelValoresProdutos(pedido);
		let listaValores="";
		valores.forEach((valor,key)=>{
			listaValores += "*"+(key+1)+"* - *"+valor.nome+"* _*R$ "+(this.formatNumber(valor.valor,2))+"*_\n\n";
		});
		return listaValores;
	}

	getListagemAcompanhamentos = (pedido) =>{
		const acompanhamentos = this.menu.getLabelAcompanhamentos(pedido);
		let listaAcompanhamentos="";
		acompanhamentos.forEach((acompanhamento,key)=>{
			listaAcompanhamentos += "*"+(key+1)+"* - *"+acompanhamento.nome+"* _*R$ "+(this.formatNumber(acompanhamento.valor,2))+"*_\n\n";
		});
		return listaAcompanhamentos;
	}
}