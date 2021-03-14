module.exports =class Mensagem {
	constructor(){
		const Menu = require("./Menu");
		this.menu = new Menu("./Menu.json");
		this.replaces = this.menu.getReplaces();
		this.navegacao = {
			voltar_menu_principal:"*0* - {voltar_menu_principal}",
			voltar_menu_categorias:"*V* - {voltar_menu_categorias}",
			voltar_item:"*V* - {voltar_item}",
			sem_extras:"*N* - {sem_extras}",
			concluir_item:"*C* - {concluir_item}",
			adicionar_mais:"*A* - {adicionar_mais}",
			remover_item:"*R* - {remover_item}",
			confirmar_produto:"*C* - {confirmar_produto}",
			descartar_produto:"*D* - {descartar_produto}"
		}
	}

	printf = (string) => {
		for(let key in this.replaces){
			let bkey = "{"+key+"}";
			string = string.replace(bkey,this.replaces[key]);
		}
		return string+"\n";
	}
/**
formatação de shchema de mensagens e navegação
*/
	formatNumber = (number,decimals=2)=> {
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
		return this.printf(this.menu.getOpcoesProdutos()+"\n\n"+this.navegacao.voltar_menu_principal);
	}

	getValoresProduto = ()  =>{
		return this.printf(this.menu.getValoresProduto()+"\n\n"+this.navegacao.voltar_menu_categorias+"\n"+this.navegacao.voltar_menu_principal);
	}
	getAcompanhamentos = () => {
		return this.printf(this.menu.getAcompanhamentos()+"\n\n"+this.navegacao.voltar_item+"\n"+this.navegacao.voltar_menu_principal)
	}

	getExtras = (pedido) => {
		if (pedido.extras.length>0) {
			return this.printf(this.menu.getExtras()+"\n\n"+this.navegacao.concluir_item+"\n\n"+this.navegacao.voltar_item+"\n"+this.navegacao.voltar_menu_principal);
		}else{
			return this.printf(this.menu.getExtras()+"\n\n"+this.navegacao.sem_extras+"\n\n"+this.navegacao.voltar_item+"\n"+this.navegacao.voltar_menu_principal);
		}
	}


/**
monta forma textual dos menus de opção
*/
	getListagemPedido = (pedido) => {
		let listagem = "";
		let total=0;
		pedido.forEach((item,key)=>{
			let totalItem=0;
			listagem+="*Item ";
			listagem+=key+1;
			listagem+="*: ";
			listagem+=this.menu.getProduto(item).nome;
			listagem+="\n";
			listagem+="_"+this.menu.getProduto(item).descricao+"_";
			listagem+="\n ";
			if (this.menu.getValorProduto(item).nome!=="") {
				listagem+=this.menu.getValorProduto(item).nome;
				listagem+=" ";
			}
			listagem+="R$ ";
			listagem+=this.formatNumber(this.menu.getValorProduto(item).valor);
			listagem+="\nAcompanha:\n";
			
			totalItem+=this.menu.getValorProduto(item).valor;
			
			item.acompanhamentos.forEach((value,key)=>{
				item.acompanhamentoAtual = key;
				listagem+="\t+*";
				listagem+=this.menu.getAcompanhamento(item).nome
				listagem+="*: ";
				listagem+=this.menu.getAcompanhamentoProduto(item).nome;
				listagem+=" _*R$ ";
				listagem+=this.formatNumber(this.menu.getAcompanhamentoProduto(item).valor);
				listagem+="_*";
				listagem+="\n";

				totalItem+=this.menu.getAcompanhamentoProduto(item).valor;
			});
			listagem+="Extras:\n";
				
			item.extras.forEach((value,key)=>{
				listagem+="\t+_";
				listagem+=this.menu.getExtrasProduto(item)[value].nome;
				listagem+="_ ";
				listagem+="*R$ ";
				listagem+=this.formatNumber(this.menu.getExtrasProduto(item)[value].valor);
				listagem+="*";
				listagem+="\n";

				totalItem+=this.formatNumber(this.menu.getExtrasProduto(item)[value].valor);

			});
			listagem+="\n";
			listagem+="Valor do item: *R$ ";
			listagem+=this.formatNumber(totalItem);
			listagem+="*";
			listagem+="\n";
			listagem+="\n";
			total+=totalItem
		});

		listagem+="\n";
		listagem+="Valor total do pedido: *R$ ";
		listagem+=this.formatNumber(total);
		listagem+="*";
		listagem+="\n\n";
		listagem+=this.navegacao.adicionar_mais;
		listagem+="\n";
		listagem+=this.navegacao.remover_item;
		listagem+="\n\n";
		listagem+=this.navegacao.concluir_item;
		

		return this.printf(listagem);
	}

	getConfirmacaoItem = (item) => {
		let listagem = "";
	
		let totalItem=0;
		
		listagem+=this.menu.getProduto(item).nome;
		listagem+="\n";
		listagem+="_"+this.menu.getProduto(item).descricao+"_";
		listagem+="\n ";
		if (this.menu.getValorProduto(item).nome!=="") {
			listagem+=this.menu.getValorProduto(item).nome;
			listagem+=" ";
		}
		listagem+="R$ ";
		listagem+=this.formatNumber(this.menu.getValorProduto(item).valor);
		listagem+="\nAcompanha:\n";
		
		totalItem+=this.menu.getValorProduto(item).valor;
		
		item.acompanhamentos.forEach((value,key)=>{
			item.acompanhamentoAtual = key;
			listagem+="\t+*";
			listagem+=this.menu.getAcompanhamento(item).nome
			listagem+="*: ";
			listagem+=this.menu.getAcompanhamentoProduto(item).nome;
			listagem+=" _*R$ ";
			listagem+=this.formatNumber(this.menu.getAcompanhamentoProduto(item).valor);
			listagem+="_*";
			listagem+="\n";

			totalItem+=this.menu.getAcompanhamentoProduto(item).valor;
		});
		listagem+="Extras:\n";
			
		item.extras.forEach((value,key)=>{
			listagem+="\t+_";
			listagem+=this.menu.getExtrasProduto(item)[value].nome;
			listagem+="_ ";
			listagem+="*R$ ";
			listagem+=this.formatNumber(this.menu.getExtrasProduto(item)[value].valor);
			listagem+="*";
			listagem+="\n";

			totalItem+=this.formatNumber(this.menu.getExtrasProduto(item)[value].valor);

		});
		listagem+="\n";
		listagem+="Valor do item: *R$ ";
		listagem+=this.formatNumber(totalItem);
		listagem+="*";
		listagem+="\n";
		listagem+="\n";
	
	

		listagem+=this.navegacao.confirmar_produto;
		listagem+="\n";
		listagem+=this.navegacao.descartar_produto;
		

		return this.printf(listagem);
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
			listaProdutos+="*"+(key+1)+"* - *"+produto.nome+"*\n"+"_"+produto.descricao+"_\n```A partir de R$ "+(this.formatNumber(produto.valor))+"```\n\n";
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
			listaAcompanhamentos += "*"+(key+1)+"* - *"+acompanhamento.nome+"* _*R$ "+(this.formatNumber(acompanhamento.valor))+"*_\n\n";
		});
		return listaAcompanhamentos;
	}

	getListagemExtras = (pedido) =>{
		const extras = this.menu.getLabelExtras(pedido);
		let listaExtras="";
		if(pedido.extras.length>0){
			listaExtras+="{extras_selecionados}\n";
			pedido.extras.forEach((extra)=>{
				listaExtras+="*** *"+extras[extra].nome+"* _*R$ "+(this.formatNumber(extras[extra].valor))+"*_\n";
			});
			listaExtras+="{adicionar_mais_extras}\n\n";
		}
		extras.forEach((extra,key)=>{
			listaExtras += "*"+(key+1)+"* - *"+extra.nome+"* _*R$ "+(this.formatNumber(extra.valor))+"*_\n\n";
		});
		return this.printf(listaExtras);
	}
}