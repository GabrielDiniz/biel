const Menu = require("./Menu");
const menu = new Menu("./menu.json");

module.exports =class Mensagem {
	constructor(){
		this.replaces = menu.getReplaces();
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
		//console.log("$$$$$$$$$$$$$$$  ",number,"    $$$$$$$    ",decimals);
		return number.toLocaleString("pt-BR",{minimumFractionDigits:decimals,maximumFractionDigits:decimals});
	}
	getMensagemPane = () =>{
		return this.printf(menu.getMensagemPane());
	}
	getItemInexistente = () =>{
		return this.printf(menu.getItemInexistente());
	}
	getApresentacao = () => {
		return this.printf(menu.getApresentacao());
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
	getAcompanhamentos = () => {
		return this.printf(menu.getAcompanhamentos()+this.navegacao.voltar_item+this.navegacao.voltar_menu_principal)
	}

	getExtras = () => {
		return this.printf("extras");
	}

	getListagemCategorias = () =>{
		const categorias = menu.getLabelCategorias();
		let listaCategorias="";
		categorias.forEach((categoria,key)=>{
			listaCategorias+="*"+(key+1)+"* - "+categoria+"\n";
		});
		return listaCategorias;
	}

	getListagemProdutos = (pedido) =>{
		const produtos = menu.getLabelProdutos(pedido);
		let listaProdutos="";
		produtos.forEach((produto,key)=>{
			listaProdutos+="*"+(key+1)+"* - *"+produto.nome+"*\n"+"_"+produto.descricao+"_\n```A partir de R$ "+(this.formatNumber(produto.valor,2))+"```\n\n";
		});
		return listaProdutos;
	}

	getListagemValoresProdutos = (pedido) => {
		const valores = menu.getLabelValoresProdutos(pedido);
		let listaValores="";
		valores.forEach((valor,key)=>{
			listaValores += "*"+(key+1)+"* - *"+valor.nome+"* _*R$ "+(this.formatNumber(valor.valor,2))+"*_\n\n";
		});
		return listaValores;
	}

	getListagemAcompanhamentos = (pedido) =>{
		const acompanhamentos = menu.getLabelAcompanhamentos(pedido);
		//console.log(acompanhamentos);
		let listaAcompanhamentos="";
		acompanhamentos.forEach((acompanhamento,key)=>{
			listaAcompanhamentos += "*"+(key+1)+"* - *"+acompanhamento.nome+"* _*R$ "+(this.formatNumber(acompanhamento.valor,2))+"*_\n\n";
		});
		return listaAcompanhamentos;
	}
}